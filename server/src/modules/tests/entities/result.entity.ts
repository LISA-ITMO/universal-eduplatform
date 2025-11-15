import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Test } from './test.entity';
import { Solution } from './solution.entity';

@ObjectType()
export class Result {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  testId: number;

  @Field(() => Test, { nullable: true })
  test?: Test;

  @Field()
  subject: string;

  @Field()
  theme: string;

  @Field(() => Int, { nullable: true })
  pointsUser?: number;

  @Field(() => Float, { nullable: true })
  score?: number;

  @Field({ nullable: true })
  passingDate?: Date;

  @Field(() => [Solution], { nullable: true })
  solutions?: Solution[];
}




