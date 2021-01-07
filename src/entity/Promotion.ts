import {Field, InputType, ObjectType} from "type-graphql";
import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import {User} from "./User";
import {Course} from "./Course";

@ObjectType('Promotion')
@InputType('PromotionInput')
@Entity()
export class Promotion extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    @IsNotEmpty()
    name!: string;

    @OneToMany(() => User, user => user.promotion)
    users!: User[];

    @ManyToMany(() => Course)
    @JoinTable({ name: 'promotion_has_courses' })
    courses!: Course[];

    @CreateDateColumn({type: "timestamp"})
    createdAt!: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt!: Date;

}

