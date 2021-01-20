import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('StudentInput')
@ObjectType('StudentType')
export class StudentInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}
