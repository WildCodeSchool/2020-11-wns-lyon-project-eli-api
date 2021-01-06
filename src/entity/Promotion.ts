import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable} from "typeorm";
import {IsAlpha, isAlphanumeric, IsEmail, IsNotEmpty, Length} from "class-validator";
import {User} from "./User";
import {Course} from "./Course";
import {Upload} from "./Upload";

@ObjectType('Promotion')
@InputType('PromotionInput')
@Entity()
export class Promotion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @OneToMany(() => User, user => user.promotion)
    users!: User[];

    @ManyToMany(() => Course)
    @JoinTable({ name: 'promotion_has_courses' })
    courses!: Course[];
}

