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

@ObjectType('QuizResults')
@InputType('QuizResultsInputs')
@Entity()
export class QuizResults extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Quiz)
  @ManyToOne(() => Quiz, (quizResults) => quizResults.quiz, {
    onDelete: 'CASCADE',
  })
  quiz!: Quiz;

  @Field(() => [Response])
  @ManyToMany(() => Response)
  @JoinTable({ name: 'quizresults_have_responses' })
  responses!: Response[];

  @ManyToOne(() => User, (user) => user.quizResults)
  user!: User;
}
