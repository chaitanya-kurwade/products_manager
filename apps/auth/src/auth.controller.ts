import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'common/library';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // client = new OAuth2Client(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  // );

  // @Post('/login')
  // async login(@Body('token') token): Promise<any> {
  //   const ticket = await this.client.verifyIdToken({
  //     idToken: token,
  //     audience: process.env.GOOGLE_CLIENT_ID,
  //   });
  //   // log the ticket payload in the console to see what we have
  //   console.log(ticket.getPayload());
  // }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}
}
