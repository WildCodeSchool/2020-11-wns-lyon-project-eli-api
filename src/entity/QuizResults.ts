import { Response } from './Response';
import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Quiz } from './Quiz';

// Student inputs
@InputType('QuizResultsInputs')
@ObjectType('QuizResultsInputsInput')
export class QuizResultsInputs {
  @Field(() => Quiz)
  quiz!: Quiz;

  @Field(() => [Response])
  responses!: Response[];
}

// Teacher management
@InputType('QuizResults')
@ObjectType('QuizResultsInput')
@Entity()
export class QuizResults extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Quiz)
  @ManyToOne(() => Quiz, (quizResults: QuizResults) => quizResults.quiz, {
    onDelete: 'CASCADE',
  })
  quiz!: Quiz;

  @Field(() => [Response])
  @ManyToMany(() => Response)
  @JoinTable({ name: 'quizresults_have_responses' })
  responses!: Response[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.quizResults)
  user!: User;
}
