import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class StudentAnalytics {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  studentId: number;

  @Field(() => Int)
  analyticity: number;

  @Field(() => Int)
  leadership: number;
}




