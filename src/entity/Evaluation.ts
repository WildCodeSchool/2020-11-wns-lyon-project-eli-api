import {Field, InputType, ObjectType} from "type-graphql";
import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    ManyToOne,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";
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
    @Column({ type: "varchar", length: 120 })
    @Length(2, 120,
        { message: 'The title must be at least 2 but not longer than 120 characters' })
    title!: string;

    @Field()
    @Column({ type: "varchar", length: 120 })
    @IsOptional()
    @Length(2, 120,
        { message: 'The title must be at least 1 but not longer than 120 characters' })
    subtitle!: string;

    @Field()
    @Column({type: "text"})
    @IsOptional()
    content!: string;

    @Field()
    @Column({type: "tinyint"})
    @IsBoolean()
    is_auto!: boolean;

    @Field()
    @Column({type: "tinyint"})
    @IsBoolean()
    is_official!: boolean;

    @Field()
    @Column({type: "smallint"})
    @IsPositive()
    max_grade!: number;

    @ManyToMany(() => Upload)
    @JoinTable({ name: 'evaluation_has_uploads' })
    uploads!: Upload[];

    @ManyToOne(() => User, user => user.teacher_evaluations)
    user!: number;

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;
}

