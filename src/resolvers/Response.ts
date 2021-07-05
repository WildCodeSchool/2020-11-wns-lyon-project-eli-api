import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from './../entity/User';
import { Response } from '../entity/Response';
import { getRepository } from 'typeorm';

@Resolver(Response)
export class ResponseResolver {
  private responseRepo = getRepository(Response);

  @Query(() => [Response])
  public async getQuestions(): Promise<Response[]> {
    return await this.responseRepo.find();
  }

  @Query(() => Response)
  public async getQuestion(@Arg('id') id: number): Promise<Response | void> {
    return await this.responseRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Response)
  public async createResponse(
    @Arg('values', () => Response) values: Response,
    //eslint-disable-next-line
    @Ctx() ctx: any
  ): Promise<Response | void> {
    const user = ctx.user;
    const newResponse = this.responseRepo.create({
      ...values,
      user,
    });

    return await this.responseRepo
      .save(newResponse)
      .catch((e) => console.log('response save error', e));
  }

  @Authorized('TEACHER')
  @Mutation(() => Response)
  public async updateResponse(
    @Arg('id') id: number,
    @Arg('values') values: Response,
    //eslint-disable-next-line
    @Ctx() ctx: any
  ): Promise<Response> {
    const response = await this.responseRepo.findOne({
      where: { id, user: ctx.user },
    });

    if (!response) {
      throw new Error(
        "Response not found or you're not authorize to update the question !"
      );
    }
    const updatedResponse = Object.assign(response, values);

    return await this.responseRepo.save(updatedResponse);
  }

  @Mutation(() => Boolean)
  public async deleteResponse(@Arg('id') id: number): Promise<boolean> {
    const response = await this.responseRepo.findOne({ where: { id } });

    if (!response) {
      throw new Error('Response not found !');
    }

    try {
      await this.responseRepo.remove(response);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this response');
    }
  }
}
