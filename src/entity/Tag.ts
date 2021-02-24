import { Field, InputType, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

@ObjectType('Tag')
@InputType('TagInput')
@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  @Length(2, 50, {
    message:
      'The tag must be at least 2 but not longer than 50 characters',
  })
  name!: string;
}
