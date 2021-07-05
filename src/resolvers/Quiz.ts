import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Quiz } from '../entity/Quiz';
import { getRepository } from 'typeorm';
import { Speciality } from '../entity/Speciality';
import { Question } from '../entity/Question';
import { Response } from '../entity/Response';
import { ResponseResolver } from './Response';
import { QuestionResolver } from './Question';
import { SpecialityResolver } from './Speciality';
import { User } from 'entity/User';

@Resolver(Quiz)
export class QuizResolver {
  private quizRepo = getRepository(Quiz);
  private questionRepo = getRepository(Question);
  private questionResolver = new QuestionResolver();
  private responseRepo = getRepository(Response);
  private ResponseResolver = new ResponseResolver();
  private specialityRepo = getRepository(Speciality);
  private specialityResolver = new SpecialityResolver();

  @Query(() => [Quiz])
  public async getQuizs(): Promise<Quiz[]> {
    return await this.quizRepo.find({
      relations: ['speciality', 'question', 'question.response'],
    });
  }

  @Query(() => Quiz)
  public async getQuiz(@Arg('id') id: number): Promise<Quiz | void> {
    return await this.quizRepo.findOne({
      where: { id },
      relations: ['speciality', 'question', 'question.response'],
    });
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async createQuiz(
    @Arg('values', () => Quiz) values: Quiz,
    //eslint-disable-next-line
    @Ctx() ctx: any
  ): Promise<Quiz | void> {
    try {
      const { name, description } = values.speciality;
      const { subject } = values;

      let speciality;
      const specialityExist = await this.specialityRepo.findOne({
        where: { name },
      });

      console.log('This speciality already exist :', specialityExist);

      if (specialityExist == undefined) {
        speciality = new Speciality();
        speciality.name = name;
        speciality.description = description;
        speciality.logo = values.speciality.logo;

        await this.specialityRepo.save(speciality);
      } else {
        speciality = specialityExist;
      }

      const quiz = new Quiz();
      quiz.subject = subject;
      quiz.author = ctx.user;
      quiz.speciality = speciality;

      await this.quizRepo.save(quiz);

      for await (const quest of values.question) {
        const qtn = new Question();
        qtn.question = quest.question;
        qtn.quiz = quiz;
        qtn.user = ctx.user;
        await this.questionRepo.save(qtn);

        for await (const res of quest.response) {
          const response = new Response();
          response.response = res.response;
          response.user = ctx.user;
          response.question = qtn;
          response.value = res.value;

          await this.responseRepo.save(response);
        }
      }
      return quiz;
    } catch (err) {
      console.log('course save error', err);
    }
  }

  @Authorized('TEACHER')
  @Mutation(() => Quiz)
  public async updateQuiz(
    @Arg('id') id: number,
    @Arg('values') values: Quiz
  ): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['question', 'question.response'],
    });

    if (!quiz) {
      throw new Error(
        "Quiz not found or you're not authorize to update the quiz !"
      );
    }

    const updatedQuiz = Object.assign(quiz, values);
    await this.quizRepo.save(updatedQuiz);

    for await (const updateQuestion of quiz.question) {
      const question = await this.questionRepo.findOne({
        where: { id: updateQuestion.id },
        relations: ['response'],
      });

      if (!question) {
        const createQuestion = new Question();
        createQuestion.question = updateQuestion.question;
        createQuestion.quiz = updatedQuiz;

        await this.questionRepo.save(createQuestion);
      } else {
        const updatedQuestion = Object.assign(question, updateQuestion);
        await this.questionRepo.save(updatedQuestion);
      }

      for await (const updateResponse of updateQuestion.response) {
        const response = await this.responseRepo.findOne({
          where: { id: updateResponse.id },
          relations: ['question'],
        });

        if (!response) {
          const createResponse = new Response();
          createResponse.response = updateResponse.response;
          createResponse.value = updateResponse.value;
          createResponse.question = updateQuestion;

          await this.responseRepo.save(createResponse);
        } else {
          const updatedResponse = Object.assign(response, updateResponse);
          await this.responseRepo.save(updatedResponse);
        }
      }

      const allResponse = await this.responseRepo.find({
        where: { question: updateQuestion },
      });

      for await (const thisResponse of allResponse) {
        let isContained = false;
        for await (const updateResponse of updateQuestion.response) {
          if (thisResponse.id === updateResponse.id) {
            isContained = true;
          }
        }

        if (!isContained) {
          await this.responseRepo.remove(thisResponse);
        }
      }
    }

    const allQuestion = await this.questionRepo.find({
      where: { quiz },
    });

    for await (const thisQuestion of allQuestion) {
      let isContained = false;
      for await (const updateQuestion of quiz.question) {
        if (thisQuestion.id === updateQuestion.id) {
          isContained = true;
        }
      }

      if (!isContained) {
        await this.questionRepo.remove(thisQuestion);
      }
    }

    return quiz;
  }

  @Authorized('TEACHER')
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
