import { Field, InputType, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsAlpha,
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

@ObjectType('ContactInformation')
@InputType('ContactInformationInput')
@Entity()
export class ContactInformation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlphanumeric()
  @IsNotEmpty()
  adress_1!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlphanumeric()
  @IsOptional()
  adress_2!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlphanumeric()
  @IsOptional()
  adress_3!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlpha()
  @IsNotEmpty()
  city!: string;

  @Field()
  @Column({ type: 'varchar', length: 70 })
  @IsAlpha()
  @IsNotEmpty()
  country!: string;
}
