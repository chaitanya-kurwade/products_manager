import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'common/library';
import { AuthGuard } from '@nestjs/passport';
import { VerificationService } from './verification/verification.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
  ) {}
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    console.log(req);
    return this.authService.googleLogin(req);
  }

  @Public()
  @Get('token')
  verifyEmail(@Query('token') token: string) {
    // console.log('controller');
    return this.verificationService.verifyEmail(token);
  }
}
