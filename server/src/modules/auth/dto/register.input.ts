import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String, { nullable: true, defaultValue: 'student' })
  @IsOptional()
  @IsString()
  role?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  middleName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone?: string;
}


