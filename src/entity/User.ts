import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn} from "typeorm";

export type ROLE = "TEACHER" | "STUDENT";

@ObjectType('User')
@InputType('UserInput')
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    email!: string;

    @Field()
    @Column()
    password!: string;

    @Field()
    @Column()
    firstName!: string;

    @Field()
    @Column()
    lastName!: string;

    @Field()
    @Column()
    role!: ROLE;

    /*
        @Field()
        @Column()
        birthdate!: string;

        @Field()
        @Column()
        gender!: string;

        @Field()
        @Column()
        phone!: string; // number ?

        @Field()
        @Column()
        adress!: string;

        @Field()
        @Column()
        created_at!: string; // Date
    */
}

