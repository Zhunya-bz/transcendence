import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { Public } from './decorators/public.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    //post /auth/signup - public(no guard)
    @Public()
    @Throttle({ default: { limit: 5, ttl: 300000 } })
    @Post('signup')
    signup(@Body() signupDto : SignupDto) {
        return this.authService.signup(signupDto);
    }

    //post /auth/login - public(no guard)
    @Public()
    @Throttle({ default: { limit: 5, ttl: 300000 } })
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    //get /auth/me - protected (requires valid jwt)
    @Get('me')
    getMe(@Request() req) {
        //req.user comes from jwtstrategy.validate()
        //which returns { userId, email }
        return this.authService.getMe(req.user.userId);
    }

    @Post('api-key')
    generateApiKey(@Body() body: { projectId: number }, @Request() req) {
        return this.authService.generateApiKey(req.user.userId, body.projectId);
    }

    //post /auth/logout - protected (requires valid jwt)
    @Post('logout')
    logout() {
        //jwt is stateless - the server doesn't store tokens.
        //logout is handled client-side (frontend deletes the token)
        return { message: 'Logged out successfully'};
    }
}