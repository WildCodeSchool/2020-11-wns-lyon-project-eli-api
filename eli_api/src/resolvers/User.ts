import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthResult } from "../entity/AuthResult";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { generateJwt } from "../utils/helpers";
import { getRepository } from "typeorm";


@Resolver(User)
export class UserResolver {
    private userRepo = getRepository(User);

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    @Query(() => User)
    @Authorized()
    public async authenticatedUser(@Ctx() ctx): Promise<User> {
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

    @Mutation(() => User)
    public async createStudent(@Arg('data', () => User) data: User): Promise<User> {
        const hash = await UserResolver.hashPassword(data.password)
        const user = this.userRepo.create({...data, password: hash});
        return await this.userRepo.save(user)
    }

    // create Teacher - data: TeacherInput
}