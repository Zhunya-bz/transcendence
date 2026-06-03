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
}
