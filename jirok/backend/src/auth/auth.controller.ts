import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';
import { FortyTwoAuthGuard } from './guards/forty-two-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  AuthTokensResponseDto,
  ApiKeyResponseDto,
  UserResponseDto,
  AuthApiErrorResponseDto,
} from './dto/auth-swagger.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //post /auth/signup - public(no guard)
  @Public()
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiCreatedResponse({ type: AuthTokensResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: AuthApiErrorResponseDto,
  })
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  //post /auth/login - public(no guard)
  @Public()
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: AuthApiErrorResponseDto,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //get /auth/me - protected (requires valid jwt)
  @ApiOperation({ summary: 'Get authenticated user' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
    type: AuthApiErrorResponseDto,
  })
  @Get('me')
  getMe(@Request() req) {
    //req.user comes from jwtstrategy.validate()
    //which returns { userId, email }
    return this.authService.getMe(req.user.userId);
  }

  @ApiOperation({ summary: 'Generate API key for a project' })
  @ApiBearerAuth('bearer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'number', example: 12 },
      },
      required: ['projectId'],
    },
  })
  @ApiOkResponse({ type: ApiKeyResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
    type: AuthApiErrorResponseDto,
  })
  @Post('api-key')
  generateApiKey(
    @Body('projectId', ParseIntPipe) projectId: number,
    @Request() req,
  ) {
    return this.authService.generateApiKey(req.user.userId, projectId);
  }

  //post /auth/logout - protected (requires valid jwt)
  @ApiOperation({ summary: 'Logout (client-side)' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
      required: ['message'],
    },
  })
  @Post('logout')
  logout() {
    //jwt is stateless - the server doesn't store tokens.
    //logout is handled client-side (frontend deletes the token)
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  login42() {}

  @Public()
  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  async fortyTwoCallback(@Req() req, @Res() res: Response) {
    const redirect = await this.authService.handle42Callback(req.user);
    return res.redirect(redirect);
  }

  @ApiOperation({ summary: 'Generate 2FA QR code for setup' })
  @ApiBearerAuth('bearer')
  @ApiOkResponse({
    description: 'QR code generated successfully',
    schema: {
      type: 'object',
      properties: {
        qrCodeDataUrl : { type: 'string', description: 'Base64 QR code image to scan with Google Auth' },
        secret: { type: 'string', description: 'Manual enter key if QR scan fails' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
    type: AuthApiErrorResponseDto,
  })
  @Post('2fa/generate')
  generateTwoFactor(@Request() req) {
    return this.authService.generateTwoFactorSecret(req.user.userId);
  }

  @ApiOperation({ summary: 'Verify code and enable 2FA' })
  @ApiBearerAuth('bearer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '123456', description: '6-digit code from Google auth app' },
      },
      required: ['code']
    },
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {type: 'string', example: '2FA enabled successfully' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid 2FA code or code not generated',
    type: AuthApiErrorResponseDto,
  })
  @Post('2fa/enable')
  enableTwoFactor(@Request() req, @Body('code') code: string) {
    return this.authService.enableTwoFactorAuth(req.user.userId, code);
  }

  @ApiOperation({ summary: 'Verify 2FA code during login' })
  @ApiBearerAuth('bearer')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '123456', description: '6-digit code from Google auth app' },
      },
      required: ['code']
    },
  })
  @ApiOkResponse({ type: AuthTokensResponseDto, description: 'Login successful after 2FA verification' })
  @ApiBadRequestResponse({
    description: 'Invalid 2FA code',
    type: AuthApiErrorResponseDto,
  })
  @Public()
  @Post('2fa/verify')
  async verifyTwoFactor(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body('code') code: string,
  ) {
    const tempToken = req?.cookies?.['token'];
    if (!tempToken) {
      throw new UnauthorizedException('Missing verification token');
    }
    const newToken = await this.authService.verifyTwoFactorCode(tempToken, code);

    res.cookie('token', newToken.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return newToken;
  }

}
