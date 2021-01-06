import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import {IsOptional, Length} from "class-validator";
import {User} from "./User";
import {Upload} from "./Upload";
import {Evaluation} from "./Evaluation";

@ObjectType('Course')
@InputType('CourseInput')
@Entity()
export class Course extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    @Length(2, 120,
        { message: 'The title must be at least 2 but not longer than 120 characters' })
    title!: string;

    @Field()
    @Column()
    @IsOptional()
    subtitle!: string;

    @Field()
    @Column()
    @IsOptional()
    content!: string;

    @Column()
    created_at!: Date;

    @ManyToOne(() => User, user => user.courses)
    user!: User;

    @ManyToMany(() => Upload)
    @JoinTable({ name: 'course_has_uploads' })
    uploads!: Upload[];

    @ManyToMany(() => Evaluation)
    @JoinTable({ name: 'courses_has_evaluations' })
    evaluations!: Evaluation[];
}

