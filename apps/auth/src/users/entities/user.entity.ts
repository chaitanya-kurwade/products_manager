import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsStrongPassword } from 'class-validator';
import { ROLES } from '../enums/role.enum';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field()
  _id: string;

  @Prop()
  @Field()
  firstName: string;

  @Prop()
  @Field()
  lastName: string;

  @IsEmail()
  @Prop()
  @Field()
  email: string;

  @IsStrongPassword()
  @Prop()
  @Field()
  password: string;

  // @Prop({ type: String, enum: ROLES })
  @Prop({ enum: ROLES, default: ROLES.USER, type: String })
  role?: ROLES;

  // @Prop({ type: Date, required: false, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: false })
  createdAt: Date;

  // @Prop({ type: Date, required: false, default: new Date() })
  @Field(() => GraphQLISODateTime, { nullable: false })
  updatedAt: Date;

  @Prop()
  @Field({ nullable: false })
  hashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
