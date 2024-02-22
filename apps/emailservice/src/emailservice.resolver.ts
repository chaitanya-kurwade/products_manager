import { Resolver } from '@nestjs/graphql';
import { EmailserviceService } from './emailservice.service';

@Resolver()
export class EmailserviceResolver {
  constructor(private readonly emailService: EmailserviceService) {}

  // @Mutation('sendEmail')
  // async sendEmail(
  //   @Args('to') to: string,
  //   @Args('subject') subject: string,
  //   @Args('body') body: string,
  // ) {
  //   await this.emailService.sendEmail(to, subject, body);
  //   return { message: 'Email sent successfully' };
  // }
}
