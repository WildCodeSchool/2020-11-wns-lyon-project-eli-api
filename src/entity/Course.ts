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
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';
import { Upload } from './Upload';
import { Evaluation } from './Evaluation';
import { Speciality } from './Speciality';

@ObjectType('Course')
@InputType('CourseInput')
@Entity()
export class Course extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'int' })
  @OneToOne(() => Speciality)
  speciality!: Speciality;

  @Field({ nullable: false })
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message: 'The title must be at least 2 but not longer than 120 characters',
  })
  title!: string;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message: 'The title must be at least 2 but not longer than 120 characters',
  })
  intro?: string;

  @Field()
  @Column({ type: 'varchar', length: 120, nullable: true })
  @Length(1, 120, {
    message:
      'The subtitle must be at least 1 but not longer than 120 characters',
  })
  subtitle?: string;

  @Field(() => String, { defaultValue: null })
  @Column({ type: 'text', nullable: true })
  content?: string | null;

  @Field(() => String, { defaultValue: null })
  @Column({ type: 'text' })
  logo?: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.courses, { nullable: false })
  user!: number;

  @ManyToMany(() => Upload)
  @JoinTable({ name: 'course_has_uploads' })
  uploads!: Upload[];

  @ManyToMany(() => Evaluation)
  @JoinTable({ name: 'courses_has_evaluations' })
  evaluations!: Evaluation[];

  @ManyToMany(() => Speciality)
  @JoinTable({ name: 'courses_has_specialities' })
  specialities!: Speciality[];
}
