import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SubjectMaterial {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  subjectId: number;

  @Field({ nullable: true })
  title?: string;

  @Field()
  url: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
