import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Answer {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  questionId: number;

  @Field()
  answerText: string;

  @Field()
  isCorrect: boolean;
}




