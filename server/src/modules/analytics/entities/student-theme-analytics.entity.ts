import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class StudentThemeAnalytics {
  @Field(() => Int)
  studentId: number;

  @Field()
  username: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field(() => Int)
  analyticityTheme: number;

  @Field(() => Int)
  leadershipTheme: number;
}
