import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Theme {
  @Field(() => Int)
  id: number;

  @Field()
  nameTheme: string;

  @Field(() => Int)
  subjectId: number;
}




