import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {AuthResult} from "../entity/AuthResult";
import {Course} from "../entity/Course";
import * as bcrypt from "bcrypt";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import {User} from "../entity/User";
import {log} from "util";
import {decodeJwt} from "../utils/helpers";


@Resolver(Course)
export class CourseResolver {
    private courseRepo = getRepository(Course);
    private userRepo = getRepository(User);

    @Query(() => [Course])
    public async getCourses(): Promise<Course[]> {
        return await this.courseRepo.find();
    }

    @Query(() => Course)
    public async getCourse(@Arg("id") id: number): Promise<Course | void> {
        return await this.courseRepo.findOne({where: {id}});
    }

    @Authorized('TEACHER')
    @Mutation(() => Course)
    public async createCourse(@Arg('values', () => Course) values: Course, @Ctx() ctx): Promise<Course | void> {
        const user = ctx.user;
        const newCourse = this.courseRepo.create({
            ...values,
            created_at: new Date().toISOString(),
            user
        });

        return await this.courseRepo.save(newCourse).catch((e) => console.log('course save error', e));


    }

    @Authorized('TEACHER')
    @Mutation(() => Course)
    public async updateCourse(@Arg('id') id: number, @Arg('values') values: Course, @Ctx() ctx): Promise<Course> {
        const course = await this.courseRepo.findOne({where: {id, user: ctx.user}});

        if (!course) {
            throw new Error('Course not found or you\'re not authorize to update the course !')
        }
        const updatedCourse = Object.assign(course, values)

        return await this.courseRepo.save(updatedCourse)
    }

    @Mutation(() => Boolean)
    public async deleteCourse(@Arg('id') id: number): Promise<Boolean> {
        const course = await this.courseRepo.findOne({where: {id}});

        if (!course) {
            throw new Error('Course not found !')
        }

        try {
            await this.courseRepo.remove(course);
            return true
        } catch (err) {
            throw new Error('you are not allowed to delete this course')
        }
    }


    // static async hashPassword(password: string): Promise<string> {
    //     const salt = await bcrypt.genSalt(10);
    //     return await bcrypt.hash(password, salt);
    // }
    //
    // @Query(() => User)
    // //@Authorized()
    // public async authenticatedUser(@Ctx() ctx): Promise<User> {
    //     return ctx.user;
    // }
    //
    // @Query(() => User)
    // //@Authorized()
    // public async getUser(@Ctx() ctx): Promise<User> {
    //     return ctx.user;
    // }
    //
    // @Mutation(() => AuthResult, { nullable: true })
    // public async authenticate(
    //     @Arg('email') email: string,
    //     @Arg('password') password: string,
    //     @Ctx() ctx
    // ): Promise<AuthResult> {
    //     const user = await this.userRepo.findOneOrFail({ email: email });
    //
    //     if (user && await bcrypt.compare(password, user.password) === true) {
    //         const token = generateJwt({ userId: user.id });
    //         ctx.res.cookie('appSession', token, { maxAge: 60, httpOnly: true });
    //         return { token, user };
    //     } else {
    //         return {};
    //     }
    // }
    //
    // /*
    //     @Mutation(() => User)
    //     public async createStudent(@Arg('data', () => User) data: User): Promise<User> {
    //         const hash = await UserResolver.hashPassword(data.password)
    //         const user = this.userRepo.create({...data, password: hash});
    //         return await this.userRepo.save(user)
    //     }
    // */
    //
    // @Mutation(() => User)
    // public async createUser(@Arg('values', () => User) values: User): Promise<User | void> {
    //
    //     // TODO
    //     // check inputs
    //     // ... create function in utils folder
    //     // + decorators in entities
    //
    //     const hash = await UserResolver.hashPassword(values.password)
    //     const user = this.userRepo.create({...values, password: hash});
    //     // validate isn't required ...
    //     // seem graphQL already manage it (with InputType / decorators in User Entity)
    //     // const errors = await validate(user);
    //     // console.log('validate errors', errors)
    //     // and so, next catch(err) isn't required to ?
    //     return await this.userRepo.save(user).catch(err => console.log('save error', err))
    // }
    //
    // // create Teacher - data: TeacherInput
}