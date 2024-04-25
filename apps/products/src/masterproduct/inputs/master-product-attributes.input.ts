import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MasterProductAttributesInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  attributeName: string;

  @Field({ nullable: false })
  value: string;
}
