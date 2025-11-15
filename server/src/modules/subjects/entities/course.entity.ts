import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Subject } from './subject.entity';
import { UserType } from '../../auth/auth.resolver';

@ObjectType()
export class Course {
  @Field(() => Int)
  id: number;

  @Field()
  nameCourse: string;

  @Field(() => Int)
  subjectId: number;

  @Field(() => Subject, { nullable: true })
  subject?: Subject;

  @Field(() => Int, { nullable: true })
  expertId?: number;

  @Field(() => UserType, { nullable: true })
  expert?: UserType;

  @Field({ nullable: true })
  description?: string;
}




