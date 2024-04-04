import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserResponse } from './user-response.entity';

@ObjectType()
export class UsersList {
  @Field(() => [UserResponse])
  users: UserResponse[];

  @Field(() => Int)
  totalCount: number;
}
