import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PublicAnswer } from './public-answer.entity';

@ObjectType('PublicQuestion')
export class PublicQuestion {
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

  @Field(() => [PublicAnswer], { nullable: true })
  answers?: PublicAnswer[];
}
