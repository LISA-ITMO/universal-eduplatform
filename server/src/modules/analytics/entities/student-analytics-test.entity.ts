import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Test } from '../../tests/entities/test.entity';

@ObjectType()
export class StudentAnalyticsTest {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  studentId: number;

  @Field(() => Int)
  testId: number;

  @Field(() => Test, { nullable: true })
  test?: Test;

  @Field(() => Int)
  analyticityTest: number;
}




