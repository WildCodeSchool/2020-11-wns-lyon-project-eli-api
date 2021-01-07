import {Field, InputType, ObjectType} from "type-graphql";
import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn, OneToOne, UpdateDateColumn, CreateDateColumn
} from "typeorm";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import {Course} from "./Course";
import {Promotion} from "./Promotion";
import {Speciality} from "./Speciality";
import {Evaluation} from "./Evaluation";
import {ContactInformation} from "./ContactInformation";

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
    @IsString()
    @IsNotEmpty({ message: 'The firstname is required' })
    firstName!: string;

    @Field()
    @Column()
    @IsString()
    @IsNotEmpty({ message: 'The lastname is required' })
    lastName!: string;

    @Field()
    @Column()
    @IsNotEmpty({ message: 'The role is required' })
    role!: ROLE;

    @OneToOne(() => ContactInformation)
    @JoinColumn()
    contact_informations!: ContactInformation;

    // for student
    @ManyToOne(() => Promotion, promotion => promotion.users)
    promotion!: Promotion;

    @ManyToMany(() => Evaluation)
    @JoinTable({ name: 'student_has_evaluations' })
    student_evaluations!: Evaluation[];

    ////

    // for teacher
    @OneToMany(() => Course, course => course.user)
    courses!: Course[];

    @OneToMany(() => Evaluation, evaluation => evaluation.user)
    teacher_evaluations!: Evaluation[];

    @ManyToMany(() => Promotion)
    @JoinTable({ name: 'teacher_has_promotions' })
    promotions!: Promotion[];

    @ManyToMany(() => Speciality)
    @JoinTable({ name: 'teacher_has_specialities' })
    specialities!: Speciality[];

    ////

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;
}

