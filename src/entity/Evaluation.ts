import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsBoolean, IsOptional, IsPositive, Length } from 'class-validator';
import { User } from './User';
import { Upload } from './Upload';
import { Tag } from './Tag';

@ObjectType('Evaluation')
@InputType('EvaluationInput')
@Entity()
export class Evaluation extends BaseEntity {
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
  @IsOptional()
  @Length(2, 120, {
    message: 'The title must be at least 1 but not longer than 120 characters',
  })
  subtitle?: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: true })
  content?: string;

  @Field({ nullable: false })
  @Column({ type: 'tinyint', default: false })
  @IsBoolean()
  is_auto!: boolean;

  @Field({ nullable: false })
  @Column({ type: 'tinyint', default: false })
  @IsBoolean()
  is_official!: boolean;

  @Field()
  @Column({ type: 'smallint', nullable: true })
  @IsPositive()
  max_grade?: number;

  @ManyToMany(() => Upload)
  @JoinTable({ name: 'evaluation_has_uploads' })
  uploads!: Upload[];

  @ManyToOne(() => User, (user) => user.teacher_evaluations, {
    nullable: false,
  })
  user!: number;

  @ManyToMany(() => Tag)
  @JoinTable({ name: 'evaluation_has_specialities' })
  specialities!: Tag[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
