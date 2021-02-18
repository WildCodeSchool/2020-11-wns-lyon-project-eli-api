import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Question } from '../entity/Question';

@Resolver(Question)
export class QuestionResolver {
  private questionRepo = getRepository(Question);

  @Query(() => Question)
  public async getQuestion(@Arg('id') id: number): Promise<Question | void> {
    return await this.questionRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Question)
  public async createQuestion(
    @Arg('values', () => Question) values: Question,
    @Arg('quiz') quiz: number,
  ): Promise<Question | void> {
    const newQuestion = this.questionRepo.create({
      ...values,
      quiz,
    });

    return await this.questionRepo
      .save(newQuestion)
      .catch((e) => console.log('Question save error', e));
  }

  @Authorized('TEACHER')
  @Mutation(() => Question)
  public async updateQuestion(
    @Arg('id') id: number,
    @Arg('values') values: Question,
  ): Promise<Question> {
    const question = await this.questionRepo.findOne({
      where: { id },
    });

    if (!question) {
      throw new Error(
        "Question not found or you're not authorize to update this one !"
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
