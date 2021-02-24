import { Authorized, Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Course } from './Course';
import { Promotion } from './Promotion';
import { Tag } from './Tag';
import { Evaluation } from './Evaluation';
import { ContactInformation } from './ContactInformation';
import { Question } from './Question';
import { Quiz } from './Quiz';

export type ROLE = 'TEACHER' | 'STUDENT';

@ObjectType('User')
@InputType('UserInput')
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 50 })
  @IsEmail({}, { message: 'Incorrect email' })
  email!: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @Length(6, 30, {
    message:
      'The password must be at least 6 but not longer than 30 characters',
  })
  password!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The firstname is required' })
  firstName!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The lastname is required' })
  lastName!: string;

  @Field()
  @Column({ type: 'varchar', length: 11 })
  @IsNotEmpty({ message: 'The role is required' })
  role!: ROLE;

  @OneToOne(() => ContactInformation)
  @JoinColumn()
  contact_informations!: ContactInformation;

  // for student

  @ManyToOne(() => Promotion, (promotion) => promotion.users)
  promotion!: number;

  @ManyToMany(() => Evaluation)
  @JoinTable({ name: 'student_has_evaluations' })
  student_evaluations!: Evaluation[];

  ////

  // for teacher
  @OneToMany(() => Course, (course) => course.user)
  courses!: Course[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.user)
  teacher_evaluations!: Evaluation[];

  @ManyToMany(() => Promotion)
  @JoinTable({ name: 'teacher_has_promotions' })
  promotions!: Promotion[];

  @Authorized('TEACHER')
  @ManyToMany(() => Tag)
  @JoinTable({ name: 'teacher_has_specialities' })
  specialities!: Tag[];

  @OneToMany(() => Quiz, (quiz ) => quiz.user)
  quizzes?: Quiz[];

  ////

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
