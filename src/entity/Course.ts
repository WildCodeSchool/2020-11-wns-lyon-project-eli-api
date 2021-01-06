import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import {IsAlpha, IsEmail, IsNotEmpty, Length} from "class-validator";
import {User} from "./User";
import {Upload} from "./Upload";

@ObjectType('Course')
@InputType('CourseInput')
@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    subtitle!: string;

    @Field()
    @Column()
    content!: string;

    @Column()
    created_at!: Date;

    @ManyToOne(() => User, user => user.courses)
    user!: User;

    @ManyToMany(() => Upload)
    @JoinTable()
    uploads!: Upload[];
}

