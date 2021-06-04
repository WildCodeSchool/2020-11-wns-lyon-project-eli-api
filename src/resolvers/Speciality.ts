import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Speciality } from '../entity/Speciality';
import { getRepository } from 'typeorm';

@Resolver(Speciality)
export class SpecialityResolver {
  private specialityRepo = getRepository(Speciality);

  @Query(() => Speciality)
  @Authorized()
  public async authenticatedUser(@Ctx() ctx): Promise<Speciality> {
    return ctx.user;
  }

  @Mutation(() => Speciality)
  public async createSpeciality(
    @Arg('name') name: string,
    @Arg('description') description: string
  ): Promise<Speciality> {
    const newSpeciality = this.specialityRepo.create({
      name,
      description,
    });

    return await this.specialityRepo.save(newSpeciality);
  }
}
