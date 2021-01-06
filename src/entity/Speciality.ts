import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {IsAlpha, IsEmail, IsNotEmpty, Length} from "class-validator";
import {User} from "./User";

@ObjectType('Speciality')
@InputType('SpecialityInput')
@Entity()
export class Speciality extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;
}

