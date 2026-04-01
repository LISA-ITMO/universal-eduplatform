import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('PublicAnswer')
export class PublicAnswer {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  questionId: number;

  @Field()
  answerText: string;
}
