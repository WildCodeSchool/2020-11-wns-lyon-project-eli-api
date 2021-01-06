import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import {IsBoolean, IsOptional, IsPositive, Length} from "class-validator";
import {User} from "./User";
import {Upload} from "./Upload";

@ObjectType('Evaluation')
@InputType('EvaluationInput')
@Entity()
export class Evaluation extends BaseEntity {
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

    @Field()
    @Column()
    @IsBoolean()
    is_auto!: boolean;

    @Field()
    @Column()
    @IsBoolean()
    is_official!: boolean;

    @Field()
    @Column()
    @IsPositive()
    max_grade!: number;

    @ManyToMany(() => Upload)
    @JoinTable({ name: 'evaluation_has_uploads' })
    uploads!: Upload[];

    @ManyToOne(() => User, user => user.teacher_evaluations)
    user!: User;

    @Column()
    created_at!: Date;
}

