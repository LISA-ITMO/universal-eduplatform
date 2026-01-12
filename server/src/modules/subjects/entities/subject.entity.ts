import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Theme } from './theme.entity';
import { Course } from './course.entity';
import { UserType } from '../../auth/auth.resolver';
import { SubjectMaterial } from './subject-material.entity';

@ObjectType()
export class Subject {
  @Field(() => Int)
  id: number;

  @Field()
  nameSubject: string;

  @Field(() => Int, { nullable: true })
  expertId?: number;

  @Field(() => UserType, { nullable: true })
  expert?: UserType;

  @Field(() => [Theme], { nullable: true })
  themes?: Theme[];

  @Field(() => [Course], { nullable: true })
  courses?: Course[];

  @Field(() => [SubjectMaterial], { nullable: true })
  subjectMaterials?: SubjectMaterial[];
}




