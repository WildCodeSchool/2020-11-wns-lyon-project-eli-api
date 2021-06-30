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
import { Question } from './Question';

@ObjectType('Response')
@InputType('ResponseInput')
@Entity()
export class Response extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message:
      'The Response must be at leadt 2 but not longer than 120 characters',
  })
  response!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => Question, (question) => question.response)
  question!: Question;

  @ManyToOne(() => User, (user) => user.quiz, { nullable: false })
  user!: number;
}
