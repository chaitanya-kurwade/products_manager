import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EmailserviceService } from './emailservice.service';
import { Public } from 'common/library';

@Resolver()
export class EmailserviceResolver {
  constructor(private readonly emailService: EmailserviceService) { }

  @Public()
  @Mutation(() => String, { name: 'forgetPassword' })
  async forgetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ) {
    await this.emailService.forgetPassword(token, newPassword);
    return { message: 'Email sent successfully' };
  }

  @Public()
  @Mutation(() => String, { name: 'verifyEmailAndCreatePassword' })
  async verifyEmailAndCreatePassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string
  ): Promise<string> {
    return this.emailService.verifyEmailAndCreatePassword(token, newPassword);
  }

  @Public()
  @Mutation(() => String, { name: 'verifyEmail' })
  async verifyEmail(
    @Args('token') token: string,
  ): Promise<string> {
    return this.emailService.verifyEmail(token);
  }
}
