import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';
import { Question } from './Question';

@ObjectType('Quiz')
@InputType('QuizInput')
@Entity()
export class Quiz extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message: 'The title must be at least 2 but not longer than 120 characters',
  })
  title!: string;

  @Field()
  @Column({ type: 'varchar', length: 120, nullable: true })
  @Length(1, 120, {
    message:
      'The subtitle must be at least 1 but not longer than 120 characters',
  })
  subtitle?: string;

  @OneToMany(() => Question, (question) => question.quiz)
  questions?: Question[];

  @ManyToOne(() => User, (user) => user.quizzes, { nullable: false })
  user!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
