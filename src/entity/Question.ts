import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { IsBoolean, Length } from 'class-validator';
import { User } from './User';
import { Upload } from './Upload';
import { Evaluation } from './Evaluation';
import { Speciality } from './Speciality';
import { Answer } from './Answer';
import { Quiz } from './Quiz';

@ObjectType('Question')
@InputType('QuestionInput')
@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message: 'The label must be at least 2 but not longer than 120 characters',
  })
  label!: string;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers?: Answer[];

  @Field({ nullable: false })
  @Column({ type: 'tinyint', default: false })
  @IsBoolean()
  multiple_choice?: boolean;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { nullable: false })
  quiz!: number;
}
