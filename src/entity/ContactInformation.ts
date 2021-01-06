import {Field, InputType, ObjectType} from "type-graphql";
import {Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import {IsAlpha, IsAlphanumeric, IsNotEmpty, IsOptional, Length} from "class-validator";
import {User} from "./User";
import {Upload} from "./Upload";
import {Evaluation} from "./Evaluation";

@ObjectType('ContactInformation')
@InputType('ContactInformationInput')
@Entity()
export class ContactInformation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    @IsAlphanumeric()
    @IsNotEmpty()
    adress_1!: string;

    @Field()
    @Column()
    @IsAlphanumeric()
    @IsOptional()
    adress_2!: string;

    @Field()
    @Column()
    @IsAlphanumeric()
    @IsOptional()
    adress_3!: string;

    @Field()
    @Column()
    @IsAlpha()
    @IsNotEmpty()
    city!: string;

    @Field()
    @Column()
    @IsAlpha()
    @IsNotEmpty()
    country!: string;

    @ManyToOne(() => User, user => user.courses)
    user!: User;
}

