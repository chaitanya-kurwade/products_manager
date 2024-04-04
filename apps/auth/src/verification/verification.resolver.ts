import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { Verification } from './entities/verification.entity';

@Resolver(() => Verification)
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  // @Mutation(() => Verification)
  // createVerification(
  //   @Args('createVerificationInput')
  //   createVerificationInput: CreateVerificationInput,
  // ) {
  //   return this.verificationService.create(createVerificationInput);
  // }

  // @Query(() => [Verification], { name: 'verification' })
  // findAll() {
  //   return this.verificationService.findAll();
  // }

  // @Query(() => Verification, { name: 'verification' })
  // findOne(@Args('_id', { type: () => Int }) _id: string) {
  //   return this.verificationService.findOne(_id);
  // }

  // @Mutation(() => Verification)
  // updateVerification(
  //   @Args('updateVerificationInput')
  //   updateVerificationInput: UpdateVerificationInput,
  // ) {
  //   return this.verificationService.update(
  //     updateVerificationInput._id,
  //     updateVerificationInput,
  //   );
  // }

  // @Mutation(() => Verification)
  // removeVerification(@Args('_id', { type: () => Int }) _id: string) {
  //   return this.verificationService.remove(_id);
  // }

  @Mutation(() => String, { name: 'sendVerificationEmail' })
  async sendVerificationEmail(@Args('email') email: string): Promise<string> {
    return await this.verificationService.sendEmailToVerifyEmail(email);
  }

  @Mutation(() => String, { name: 'verifyemail' })
  async verifyEmail(@Args('token') token: string): Promise<string> {
    return this.verificationService.verifyEmail(token);
  }
}
