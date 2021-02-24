import { Field, InputType, Int, ObjectType } from 'type-graphql';
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
import { Tag } from './Tag';
import { Question } from './Question';

@ObjectType('Answer')
@InputType('AnswerInput')
@Entity()
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  uuid!: number;

  @Field()
  @Column()
  id!: number;

  @Field({ nullable: false })
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message: 'The label must be at least 2 but not longer than 120 characters',
  })
  label!: string;

  @Field({ nullable: false })
  @Column({ type: 'tinyint', default: false })
  @IsBoolean()
  is_correct!: boolean;

  @Field(() => Int)
  @ManyToOne(() => Question, (question ) => question.answers, { nullable: false })
  question!: number;
}

/*
@InputType('AnswerInput')
export class AnswerInput extends BaseEntity {
  @Field(() => String, { nullable: false })
  @Length(2, 120, {
    message: 'The label must be at least 2 but not longer than 120 characters',
  })
  label!: string;

  @Field({ nullable: false })
  @IsBoolean()
  is_correct!: boolean;

  @Field(() => Int)
  question!: number;
}
*/
