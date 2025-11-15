import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserType } from '../../auth/auth.resolver';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
export class AuditLog {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => UserType, { nullable: true })
  user?: UserType;

  @Field()
  action: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  meta?: any;

  @Field()
  createdAt: Date;
}

