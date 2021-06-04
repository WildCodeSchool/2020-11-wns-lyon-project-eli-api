import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';
import { Question } from './Question';

@ObjectType('Quiz')
@InputType('QuizInput')
@Entity()
export class Quiz extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message:
      'The subject must be at least 2 but not longer than 120 characters',
  })
  subject!: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => Question, (question) => question.quiz)
  question!: Question[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.quiz, { nullable: false })
  author!: User;
}
