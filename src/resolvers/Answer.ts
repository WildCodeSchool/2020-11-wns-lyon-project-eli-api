import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Answer } from '../entity/Answer';

@Resolver(Answer)
export class AnswerResolver {
  private answerRepo = getRepository(Answer);

  @Query(() => Answer)
  public async getAnswer(@Arg('id') id: number): Promise<Answer | void> {
    return await this.answerRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Answer)
  public async createAnswer(
    @Arg('values', () => Answer) values: Answer,
    @Arg('question') question: number
  ): Promise<Answer | void> {
    const { id, label, is_correct } = values;
    const newAnswer = this.answerRepo.create({
      id,
      label,
      is_correct,
      question,
    });

    return await this.answerRepo
      .save(newAnswer)
      .catch((e) => console.log('Answer save error', e));
  }

  @Authorized('TEACHER')
  @Mutation(() => Answer)
  public async updateAnswer(
    @Arg('id') id: number,
    @Arg('values') values: Answer
  ): Promise<Answer> {
    const answer = await this.answerRepo.findOne({
      where: { id },
    });

    if (!answer) {
      throw new Error(
        "Answer not found or you're not authorize to update this one !"
      );
    }
    const updatedAnswer = Object.assign(answer, values);
    return await this.answerRepo.save(updatedAnswer);
  }

  @Mutation(() => Boolean)
  public async deleteAnswer(@Arg('id') id: number): Promise<boolean> {
    const answer = await this.answerRepo.findOne({ where: { id } });

    if (!answer) {
      throw new Error('Answer not found !');
    }

    try {
      await this.answerRepo.remove(answer);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this answer');
    }
  }
}
