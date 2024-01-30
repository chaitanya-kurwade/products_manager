import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserLogoutEntity {
  @Field()
  loggedOut: string;
}
