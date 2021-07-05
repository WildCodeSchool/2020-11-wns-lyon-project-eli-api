import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { QuizResults } from './../entity/QuizResults';

@Resolver(QuizResults)
export class QuizResultsResolver {
  private quizResultsRepo = getRepository(QuizResults);

  @Query(() => [QuizResults])
  public async getQuizResults(): Promise<QuizResults[]> {
    return await this.quizResultsRepo.find({
      relations: ['user', 'quiz'],
    });
  }

  @Query(() => QuizResults)
  public async getQuizResult(
    @Arg('id') id: number
  ): Promise<QuizResults | undefined> {
    return await this.quizResultsRepo.findOne({
      where: { id },
      relations: ['user', 'quiz', 'responses'],
    });
  }

  @Authorized('STUDENT')
  @Mutation(() => QuizResults)
  public async createQuizResult(
    @Arg('values', () => QuizResults)
    values: QuizResults,
    @Ctx() ctx
  ): Promise<QuizResults | void> {
    try {
      const quizResult = new QuizResults();
      quizResult.quiz = values.quiz;
      quizResult.responses = values.responses;
      quizResult.user = ctx.user;
      return await this.quizResultsRepo.save(quizResult);
    } catch (err) {
      console.error(err);
    }
  }
}
