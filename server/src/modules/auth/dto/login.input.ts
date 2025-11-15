import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  identifier: string; // email or username

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}




