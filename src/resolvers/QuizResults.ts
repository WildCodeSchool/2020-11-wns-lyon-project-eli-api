import { QuizResolver } from './Quiz';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Quiz } from '../entity/Quiz';
import { getRepository } from 'typeorm';
import { Response } from '../entity/Response';
import { QuizResults } from './../entity/QuizResults';

@Resolver(QuizResults)
export class QuizResultsResolver {
  private quizResultsRepo = getRepository(QuizResults);
  private quizResultsResolver = getRepository(QuizResults);
  private responseRepo = getRepository(Response);

  @Query(() => [QuizResults])
  public async getQuizResults(): Promise<QuizResults[]> {
    return await this.quizResultsRepo.find({
      relations: ['User', 'Quiz'],
    });
  }

  @Query(() => QuizResults)
  public async getQuizResult(@Arg('id') id: number): Promise<Quiz | void> {
    return await this.quizResultsRepo.findOne({
      where: { id },
      relations: ['User', 'Quiz'],
    });
  }
}
