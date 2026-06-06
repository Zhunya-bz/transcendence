import * as crypto from 'crypto';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
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
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private httpService: HttpService,
    private prisma: PrismaService,
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

    // compare the plain password with the stored hash, bcrypt.compare() hashes and the input and checks. do not decrypt the hash
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }   

    if (user.isTwoFactorEnabled) {
        const tempToken = this.jwtService.sign(
            { sub: user.id, email: user.email, isTwoFactor: true },
            {secret: process.env.JWT_SECRET! + '-2fa-temp', expiresIn: '5m'},
        );
        return { require2FA: true, tempToken };
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
    const redirect = `${process.env.FRONTEND_URL}/auth/42/callback?token=${encodeURIComponent(
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

    //2FA
  async generateTwoFactorSecret(userId: number) {
      const user = await this.userService.findOne(userId);
      if (!user) {
          throw new NotFoundException('User not found');
      }

      const secret = authenticator.generateSecret();

      await this.prisma.user.update({
          where: { id: userId },
          data: { twoFactorSecret: this.encryptSecret(secret) },
      });

      const otpauthUrl = authenticator.keyuri(user.email, 'Jirok', secret);

      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

      return { qrCodeDataUrl, secret };
  }

  private encryptSecret(secret: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256')
      .update(process.env.JWT_SECRET!)
      .digest();
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(secret, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
  }

  private decryptSecret(encryptedSecret: string): string {
    const [ivHex, encryptedText] = encryptedSecret.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.createHash('sha256')
      .update(process.env.JWT_SECRET!)
      .digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async enableTwoFactorAuth(userId: number, code:string) {
      const user = await this.prisma.user.findUnique({
          where: { id: userId },
      });

      if (!user || !user.twoFactorSecret) {
          throw new BadRequestException('2FA secret not generated yet');
      }

      const isValid = authenticator.verify({
          token: code,
          secret: this.decryptSecret(user.twoFactorSecret),
      });

      if (!isValid) {
          throw new BadRequestException('Invalid 2FA code');
      }

      await this.prisma.user.update({
          where: { id:userId },
          data: { isTwoFactorEnabled: true },
      });

      return { message: '2FA enabled successfully' };
  }

    //verify 2FA code for login
  async verifyTwoFactorCode(token: string, code: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET! + '-2fa-temp',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid verification token');
    }

    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA is not setup');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: this.decryptSecret(user.twoFactorSecret),
    });

    if(!isValid) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const accessToken = this.generateToken(user);
    return { accessToken };
  }
}