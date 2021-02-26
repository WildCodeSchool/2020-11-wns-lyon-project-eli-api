import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Tag } from '../entity/Tag';
import { getRepository } from 'typeorm';
import { Course } from '../entity/Course';

@Resolver(Tag)
export class TagResolver {
  private tagRepo = getRepository(Tag);

  @Query(() => Tag)
  @Authorized()
  public async authenticatedUser(@Ctx() ctx): Promise<Tag> {
    return ctx.user;
  }

  @Mutation(() => Tag)
  public async createTag(
    @Arg('values') values: Tag,
  ): Promise<Tag> {
    const { name } = values
    const newTag = this.tagRepo.create({
      name,
    });

    return await this.tagRepo.save(newTag);
  }

  @Query(() => Tag)
  public async getTagByName(@Arg('name') name: string): Promise<Tag | void> {

    return await this.tagRepo.findOne({ where: { name } });
  }
}
