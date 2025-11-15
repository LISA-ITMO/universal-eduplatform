import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Answer } from './answer.entity';

@ObjectType()
export class Question {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  testId: number;

  @Field()
  questionText: string;

  @Field()
  additionInfo: string;

  @Field(() => Int)
  questionPoints: number;

  @Field(() => [Answer], { nullable: true })
  answers?: Answer[];
}




