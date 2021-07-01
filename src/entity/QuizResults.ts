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
  @Field({ nullable: false })
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Quiz, (quizResults) => quizResults.quiz, {
    onDelete: 'CASCADE',
  })
  quiz!: Quiz;

  @ManyToMany(() => Response)
  @JoinTable({ name: 'quizresults_have_responses' })
  responses!: Response[];

  @ManyToOne(() => User, (user) => user.quizResults)
  user!: User;
}
