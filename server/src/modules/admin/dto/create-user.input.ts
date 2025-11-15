import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsString()
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  middleName?: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String)
  @IsString()
  role: string; // 'student' or 'teacher'

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;
}
