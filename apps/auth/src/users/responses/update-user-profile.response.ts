import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateUserProfileResponse {
  @Field({ nullable: true })
  _id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  addLineOne?: string;

  @Field({ nullable: true })
  addLineTwo?: string;

  @Field({ nullable: true })
  pin?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  landMark?: string;

  //image
  @Field({ nullable: true })
  avatarUrl?: string;
}
