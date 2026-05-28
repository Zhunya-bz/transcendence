import * as crypto from 'crypto';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto} from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    //signup
    async signup(signupDto: SignupDto) {
        // check if email already exists
        const existingUser = await this.userService.findByEmail(signupDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        // Hash the string password, the 10 is the standard the salt rounds - how many times bcrypt re-hashes.
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);

        // create the user in database, pass the passwordHash and not the plain password

        const user = await this.userService.create({
            name: signupDto.name,
            email: signupDto.email,
            passwordHash: hashedPassword,
            surname: signupDto.surname,
        });

        // generate a jwt token to login user immidiately
        const token = this.generateToken(user.id, user.email);

        return { accessToken: token};
    }

    //login
    async login(loginDto: LoginDto) {
        //find user by email
        const user = await this.userService.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // compare the plain password with the stored hash, bcrypt.compare() hashes and the input and checks. do not decrypt the hash
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // if password matches generate and return a JWT
        const token = this.generateToken(user.id, user.email);

        return { accessToken: token };
    }

    //get current user
    async getMe(userId: number) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async generateApiKey(userId: number, projectId: number) {
        const rawKey = crypto.randomBytes(32).toString('hex');
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
        await this.userService.createApiKey(userId, projectId, keyHash);
        return { apiKey: rawKey };
    }

    

    // generate JWT
    private generateToken(userId: number, email: string): string {
        // sub holds the user id this is what JwtStrategy.validate() reads back
        const payload = { sub: userId, email: email };
        return this.jwtService.sign(payload);
    }
}