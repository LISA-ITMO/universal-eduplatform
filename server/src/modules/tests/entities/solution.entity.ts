import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class Solution {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  resultId: number;

  @Field(() => Int)
  questionId: number;

  @Field(() => Int)
  userAnswer: number;
  
  @Field(() => GraphQLJSONObject, { nullable: true })
  userAnswers?: any;
}

@InputType()
export class SolutionInput {
  @Field(() => Int)
  questionId: number;
  @Field(() => [Int])
  userAnswers: number[];
}
