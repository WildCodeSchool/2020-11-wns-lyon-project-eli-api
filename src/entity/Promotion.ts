import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';
import { Course } from './Course';

@ObjectType('Promotion')
@InputType('PromotionInput')
@Entity()
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 70 })
  @Length(1, 70, {
    message:
      'The promotion must be at least 1 but not longer than 70 characters',
  })
  name!: string;

  @OneToMany(() => User, (user) => user.promotion)
  users!: User[];

  @ManyToMany(() => Course)
  @JoinTable({ name: 'promotion_has_courses' })
  courses!: Course[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
