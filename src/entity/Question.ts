import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';
import { Quiz } from './Quiz';

@ObjectType('Question')
@InputType('QuestionInput')
@Entity()
export class Question extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message:
      'The Question must be at leadt 2 but not longer than 120 characters',
  })
  question!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.question)
  quiz!: string;

  @ManyToOne(() => User, (user) => user.quiz, { nullable: false })
  user!: User;
}
