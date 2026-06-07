import * as crypto from 'crypto';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type FortyTwoProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  //signup
  async signup(signupDto: SignupDto) {
    // check if email already exists
    const existingUser = await this.userService.findByEmail(signupDto.email);
    if (existingUser && existingUser.passwordHash) {
      throw new ConflictException('Email already in use');
    }

    // Hash the string password, the 10 is the standard the salt rounds - how many times bcrypt re-hashes.
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);


    // create the user in database, pass the passwordHash and not the plain password
    let user;
    if (!existingUser) {
      user = await this.userService.create({
        name: signupDto.name,
        email: signupDto.email,
        passwordHash: hashedPassword,
        surname: signupDto.surname,
      });
    } else {
      user = await this.userService.update(existingUser.id, {
        passwordHash: hashedPassword,
      });
    }

    // generate a jwt token to login user immidiately
    const token = this.generateToken(user);

    return { accessToken: token };
  }

  //login
  async login(loginDto: LoginDto) {
    //find user by email
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // compare the plain password with the stored hash, bcrypt.compare() hashes and the input and checks. do not decrypt the hash
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // if password matches generate and return a JWT
    const token = this.generateToken(user);

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

  // generate JWT (accepts a user-like object)
  private generateToken(user: { id: number; email: string }): string {
    // sub holds the user id this is what JwtStrategy.validate() reads back
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  // Handle 42 OAuth callback business logic
  handle42Callback(user: { id: number; email: string }): string {
    const token = this.generateToken(user);
    const redirect = `/auth/42/callback?token=${encodeURIComponent(
      token,
    )}`;
    return redirect;
  }

  async fetch42Profile(accessToken: string): Promise<FortyTwoProfile> {
    const response = await firstValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data as FortyTwoProfile;
  }

  async validate42User(accessToken: string) {
    const profile = await this.fetch42Profile(accessToken);

    return this.findOrCreate42User(profile);
  }

  async findOrCreate42User(profile: FortyTwoProfile) {
    const fortyTwoId = profile.id.toString();

    let user = await this.userService.findByFortyTwoId(fortyTwoId);

    if (user) {
      return user;
    }

    user = await this.userService.findByEmail(profile.email);

    if (user) {
      return this.userService.linkFortyTwoAccount(user.id, fortyTwoId);
    }

    return this.userService.createOAuthUser({
      fortyTwoId,
      email: profile.email,
      name: profile.first_name,
      surname: profile.last_name,
    });
  }
}
