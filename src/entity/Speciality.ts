import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { Course } from './Course';

@ObjectType('Speciality')
@InputType('SpecialityInput')
@Entity()
export class Speciality extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  @Length(2, 50, {
    message:
      'The speciality must be at least 2 but not longer than 50 characters',
  })
  name!: string;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  @Length(2, 120, {
    message: 'The title must be at least 2 but not longer than 120 characters',
  })
  description!: string;

  @OneToMany(() => Course, (course) => course.id)
  @JoinColumn({ name: 'courses_speciality' })
  course!: Course[];
}
