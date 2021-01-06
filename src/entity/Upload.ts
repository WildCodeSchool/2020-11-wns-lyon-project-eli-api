import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {IsAlpha, IsEmail, IsNotEmpty, isURL, Length} from "class-validator";
import {User} from "./User";

@ObjectType('Upload')
@InputType('UploadInput')
@Entity()
export class Upload extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    url!: string;
}

