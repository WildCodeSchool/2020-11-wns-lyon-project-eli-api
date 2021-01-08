import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Speciality } from "../entity/Speciality";
import {getRepository} from "typeorm";


@Resolver(Speciality)
export class UserResolver {
    private specialityRepo = getRepository(Speciality);


    @Query(() => Speciality)
    @Authorized()
    public async authenticatedUser(@Ctx() ctx): Promise<Speciality> {
        return ctx.user;
    }


    @Mutation(() => Speciality)
    public async createSpeciality(@Arg('name') name: string): Promise<Speciality> {

        const newSpeciality = this.specialityRepo.create({
            name
        })

        return await this.specialityRepo.save(newSpeciality);
    }

}