import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PublicQuestion } from './public-question.entity';
import { UserType } from '../../auth/auth.resolver';
import { Subject } from '../../subjects/entities/subject.entity';
import { Theme } from '../../subjects/entities/theme.entity';

@ObjectType('PublicTest')
export class PublicTest {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  authorId: number;

  @Field(() => UserType, { nullable: true })
  author?: UserType;

  @Field(() => Int)
  subjectId: number;

  @Field(() => Subject, { nullable: true })
  subject?: Subject;

  @Field(() => Int)
  themeId: number;

  @Field(() => Theme, { nullable: true })
  theme?: Theme;

  @Field(() => Int)
  timesSolved: number;

  @Field(() => Int)
  expertId: number;

  @Field(() => Int)
  maxPoints: number;

  @Field(() => Int)
  questionsCount?: number;

  @Field(() => [PublicQuestion], { nullable: true })
  questions?: PublicQuestion[];
}
