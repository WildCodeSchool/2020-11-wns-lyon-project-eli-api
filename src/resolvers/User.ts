import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthResult } from "../entity/AuthResult";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { generateJwt } from "../utils/helpers";
import {getRepository} from "typeorm";
import {validate} from "class-validator";


@Resolver(User)
export class UserResolver {
    private userRepo = getRepository(User);

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    @Query(() => User)
    //@Authorized()
    public async authenticatedUser(@Ctx() ctx): Promise<User> {
        return ctx.user;
    }

    @Query(() => User)
    //@Authorized()
    public async getUser(@Ctx() ctx): Promise<User> {
        return ctx.user;
    }

    @Mutation(() => AuthResult, { nullable: true })
    public async authenticate(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx
    ): Promise<AuthResult> {
        const user = await this.userRepo.findOneOrFail({ email: email });

        if (user && await bcrypt.compare(password, user.password) === true) {
            const token = generateJwt({ userId: user.id });
            ctx.res.cookie('appSession', token, { maxAge: 60, httpOnly: true });
            return { token, user };
        } else {
            return {};
        }
    }

/*
    @Mutation(() => User)
    public async createStudent(@Arg('data', () => User) data: User): Promise<User> {
        const hash = await UserResolver.hashPassword(data.password)
        const user = this.userRepo.create({...data, password: hash});
        return await this.userRepo.save(user)
    }
*/

    @Mutation(() => User)
    public async createUser(@Arg('values', () => User) values: User): Promise<User | void> {

        // TODO
        // check inputs
        // ... create function in utils folder
        // + decorators in entities

        const hash = await UserResolver.hashPassword(values.password)
        const user = this.userRepo.create({...values, password: hash});
        // validate isn't required ...
        // seem graphQL already manage it (with InputType / decorators in User Entity)
        // const errors = await validate(user);
        // console.log('validate errors', errors)
        // and so, next catch(err) isn't required to ?
        return await this.userRepo.save(user).catch(err => console.log('save error', err))
    }

    // create Teacher - data: TeacherInput
}