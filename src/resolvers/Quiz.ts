import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Quiz } from '../entity/Quiz';
import { AnswerResolver } from './Answer';
import { QuestionResolver } from './Question';
import { Question } from '../entity/Question';
import { Answer } from '../entity/Answer';

@Resolver(Quiz)
export class QuizResolver {
  private quizRepo = getRepository(Quiz);
  private questionResolver = new QuestionResolver()
  private answerResolver = new AnswerResolver()

  @Query(() => Quiz)
  public async getQuiz(@Arg('id') id: number): Promise<Quiz | void> {
    return await this.quizRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async createQuiz(
    @Arg('values', () => Quiz) values: Quiz,
    @Ctx() ctx
  ): Promise<Quiz | void> {
    const user = ctx.user;

    try {
      let newQuiz = this.quizRepo.create({
        ...values,
        user: user.id,
      });
      const quiz = await this.quizRepo.save(newQuiz);
      // now we can assign quiz.id to each question
      quiz.questions?.map(async q => {
        const question: Question | void = await this.questionResolver.createQuestion(q, quiz.id);
        if (question) {
          question.answers?.map(async a => {
            await this.answerResolver.createAnswer(a, question.uuid)
          })
        }
      })
    }
     catch (e) {
      console.log('error createQuiz', e)
    }
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async updateQuiz(
    @Arg('id') id: number,
    @Arg('values') values: Quiz,
    @Ctx() ctx
  ): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { id, user: ctx.user },
    });

    if (!quiz) {
      throw new Error(
        "Quiz not found or you're not authorize to update this one !"
      );
    }
    const updatedQuiz = Object.assign(quiz, values);
    return await this.quizRepo.save(updatedQuiz);
  }

  @Mutation(() => Boolean)
  public async deleteQuiz(@Arg('id') id: number): Promise<boolean> {
    const quiz = await this.quizRepo.findOne({ where: { id } });

    if (!quiz) {
      throw new Error('Quiz not found !');
    }

    try {
      await this.quizRepo.remove(quiz);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this quiz');
    }
  }
}
