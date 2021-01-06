import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import {IsAlpha, IsEmail, IsNotEmpty, Length} from "class-validator";
import {Course} from "./Course";
import {Promotion} from "./Promotion";
import {Upload} from "./Upload";
import {Speciality} from "./Speciality";

export type ROLE = "TEACHER" | "STUDENT";

@ObjectType('User')
@InputType('UserInput')
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    @IsEmail({}, { message: 'Incorrect email' })
    email!: string;

    @Field()
    @Column()
    @Length(6, 30,
        { message: 'The password must be at least 6 but not longer than 30 characters' })
    password!: string;

    @Field()
    @Column()
    // @IsAlpha()
    @IsNotEmpty({ message: 'The firstname is required' })
    firstName!: string;

    @Field()
    @Column()
    // @IsAlpha()
    @IsNotEmpty({ message: 'The lastname is required' })
    lastName!: string;

    @Field()
    @Column()
    @IsNotEmpty({ message: 'The role is required' })
    role!: ROLE;

    @OneToMany(() => Course, course => course.user)
    courses!: Course[];

    // for student
    @ManyToOne(() => Promotion, promotion => promotion.users)
    promotion!: Promotion;


    //for teacher
    @ManyToMany(() => Promotion)
    @JoinTable()
    promotions!: Promotion[];

    // for teacher
    @ManyToMany(() => Speciality)
    @JoinTable()
    specialities!: Speciality[];

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

