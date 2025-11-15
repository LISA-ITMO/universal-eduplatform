import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Question } from './question.entity';
import { UserType } from '../../auth/auth.resolver';
import { Subject } from '../../subjects/entities/subject.entity';
import { Theme } from '../../subjects/entities/theme.entity';

@ObjectType()
export class Test {
  @Field(() => Int)
  id: number;

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

  @Field(() => [Question], { nullable: true })
  questions?: Question[];
}




