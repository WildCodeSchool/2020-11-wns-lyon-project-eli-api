import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Quiz } from '../entity/Quiz';
import { AnswerResolver } from './Answer';
import { QuestionResolver } from './Question';
import { Question } from '../entity/Question';
import { Tag } from '../entity/Tag';
import { Answer } from '../entity/Answer';

@Resolver(Quiz)
export class QuizResolver {
  private quizRepo = getRepository(Quiz);
  private tagRepo = getRepository(Tag);

  private questionResolver = new QuestionResolver();
  private answerResolver = new AnswerResolver();

  private getQuizToEdit = async (id: number, user: number) => {
    const quiz = await this.quizRepo.findOne({
      where: { id, user },
    });

    if (!quiz) {
      throw new Error(
        "Quiz not found or you're not authorize to update this one !"
      );
    }
    return quiz;
  };

  @Query(() => Quiz)
  public async getQuiz(@Arg('id') id: number): Promise<Quiz | void> {
    const quiz = await this.quizRepo.findOne({ where: { id } });

    if (!quiz) {
      throw new Error('Quiz not found, sorry !');
    }
    return quiz;
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async createQuiz(
    @Arg('values', () => Quiz) values: Quiz,
    @Ctx() ctx
  ): Promise<Quiz | void> {
    try {
      let newQuiz = this.quizRepo.create({
        ...values,
        user: ctx.user.id,
      });
      const quiz = await this.quizRepo.save(newQuiz);
      // now we can assign quiz.id to each question
      quiz.questions?.map(async (q: Question) => {
        const question: Question | void = await this.questionResolver.createQuestion(
          q,
          quiz.id
        );
        if (question) {
          question.answers?.map(async (a: Answer) => {
            return await this.answerResolver.createAnswer(a, question.uuid);
          });
        }
        return question
      });
      console.log(quiz)
      // idem for tags
      //TODO
      //  tags
      return await this.quizRepo.save(quiz)
    } catch (e) {
      console.log('error createQuiz', e);
      throw new Error('Oups, something wrong ! Please retry later');
    }
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async updateQuiz(
    @Arg('id') id: number,
    @Arg('values') values: Quiz,
    @Ctx() ctx
  ): Promise<Quiz> {
    let quiz = await this.getQuizToEdit(id, ctx.user.id);
    const updatedQuiz = Object.assign(quiz, values);
    return await this.quizRepo.save(updatedQuiz);
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async assignQuestionTag(
    @Arg('id') id: number,
    @Arg('value') value: number,
    @Ctx() ctx
  ): Promise<Quiz> {
    let quiz = await this.getQuizToEdit(id, ctx.user.id);
    const tag = await this.tagRepo.findOne({ where: { id: value } });

    if (!tag) {
      throw new Error('Tag not found, sorry !');
    }

    if (!quiz.tags) quiz.tags = [];

    const updatedQuiz = Object.assign(quiz, {
      tags: [...quiz.tags, tag],
    });

    return await this.quizRepo.save(updatedQuiz);
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async removeQuestionTag(
    @Arg('id') id: number,
    @Arg('value') value: number,
    @Ctx() ctx
  ): Promise<Quiz> {
    let quiz = await this.getQuizToEdit(id, ctx.user.id);
    if (quiz.tags) quiz.tags = quiz.tags.filter((tag) => tag.id !== value);

    return await this.quizRepo.save(quiz);
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
