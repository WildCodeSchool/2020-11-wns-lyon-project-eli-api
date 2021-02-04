import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUrl } from 'class-validator';

import DbAwareColumn from './decoratorConverter';

@ObjectType('Upload')
@InputType('UploadInput')
@Entity()
export class Upload extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  @IsUrl()
  url!: string;

  @DbAwareColumn({ type: 'timestamp', nullable: true })
  createdAt!: Date;

  @DbAwareColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date;
}
