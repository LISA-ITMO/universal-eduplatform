import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Theme } from './theme.entity';
import { Course } from './course.entity';

@ObjectType()
export class Subject {
  @Field(() => Int)
  id: number;

  @Field()
  nameSubject: string;

  @Field(() => [Theme], { nullable: true })
  themes?: Theme[];

  @Field(() => [Course], { nullable: true })
  courses?: Course[];
}




