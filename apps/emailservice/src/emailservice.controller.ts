import { Controller, Get, Query } from '@nestjs/common';
import { EmailserviceService } from './emailservice.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Public } from 'common/library';

@Controller('emailservice')
export class EmailserviceController {
  constructor(private readonly emailserviceService: EmailserviceService) { }

  @EventPattern('sendEmailToVerifyEmail', { async: true })
  async sendEmailToVerifyEmail(@Payload() user: any): Promise<string> {
    this.emailserviceService.sendEmailToVerifyEmail(user);
    return await ({ message: 'sendEmailToVerifyEmail processed successfully.' } + user.email);
  }

  @EventPattern('sendEmailToVerifyEmailAndCreatePassword', { async: true })
  async sendEmailToVerifyEmailAndCreatePassword(@Payload() user: any): Promise<string> {
    this.emailserviceService.sendEmailToVerifyEmailAndCreatePassword(user);
    return await ({ message: 'sendEmailToVerifyEmailAndCreatePassword processed successfully.' } + user.email);
  }

  @EventPattern('forgetPasswordSendEmail', { async: true })
  async forgetPasswordSendEmail(@Payload() user: any): Promise<string> {
    return this.emailserviceService.forgetPasswordSendEmail(user);
  }

  @Public()
  @Get('getTokenAndCretePassword')
  verifyEmailAndCreatePassword(
    @Query('token') uniqueString: string,
    @Query('newPassword') newPassword?: string,
  ): Promise<string> {
    return this.emailserviceService.verifyEmailAndCreatePassword(uniqueString, newPassword);
  }

  @Public()
  @Get('getTokenAndCretePassword')
  verifyEmail(
    @Query('token') token: string,
    // @Query('newPassword') newPassword?: string,
  ): Promise<string> {
    // console.log('controller');
    // CODE
    // FIND UPDATE(EMAIL,{CODE})
    return this.emailserviceService.verifyEmail(token);
  }
}
