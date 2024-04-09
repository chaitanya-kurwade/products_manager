import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserLoginCredential {
  @Field(() => User)
  user: User;

  @Field()
  userCredential: string;
}
