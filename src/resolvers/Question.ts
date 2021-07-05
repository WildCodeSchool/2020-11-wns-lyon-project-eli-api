import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Question } from '../entity/Question';
import { getRepository } from 'typeorm';

@Resolver(Question)
export class QuestionResolver {
  private questionRepo = getRepository(Question);

  @Query(() => [Question])
  public async getQuestions(): Promise<Question[]> {
    return await this.questionRepo.find();
  }

  @Query(() => Question)
  public async getQuestion(@Arg('id') id: number): Promise<Question | void> {
    return await this.questionRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Question)
  public async createQuestion(
    @Arg('values', () => Question) values: Question,
    // eslint-disable-next-line
    @Ctx() ctx
  ): Promise<Question | void> {
    const user = ctx.user;
    const newQuestion = this.questionRepo.create({
      ...values,
      user,
    });

    return await this.questionRepo
      .save(newQuestion)
      .catch((e) => console.log('question save error', e));
  }

  @Authorized('TEACHER')
  @Mutation(() => Question)
  public async updateQuestion(
    @Arg('id') id: number,
    @Arg('values') values: Question,
    //eslint-disable-next-line
    @Ctx() ctx: any
  ): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id, user: ctx.user },
    });

    if (!question) {
      throw new Error(
        "Question not found or you're not authorize to update the question !"
      );
    }
    const updatedQuestion = Object.assign(question, values);

    return await this.questionRepo.save(updatedQuestion);
  }

  @Mutation(() => Boolean)
  public async deleteQuestion(@Arg('id') id: number): Promise<boolean> {
    const question = await this.questionRepo.findOne({ where: { id } });

    if (!question) {
      throw new Error('Question not found !');
    }

    try {
      await this.questionRepo.remove(question);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this question');
    }
  }
}
