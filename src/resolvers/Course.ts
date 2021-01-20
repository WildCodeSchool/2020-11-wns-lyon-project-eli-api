import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Course } from '../entity/Course';
import { getRepository } from 'typeorm';

@Resolver(Course)
export class CourseResolver {
  private courseRepo = getRepository(Course);

  @Query(() => [Course])
  public async getCourses(): Promise<Course[]> {
    return await this.courseRepo.find();
  }

  @Query(() => Course)
  public async getCourse(@Arg('id') id: number): Promise<Course | void> {
    return await this.courseRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Course)
  public async createCourse(
    @Arg('values', () => Course) values: Course,
    @Ctx() ctx
  ): Promise<Course | void> {
    const user = ctx.user;
    const newCourse = this.courseRepo.create({
      ...values,
      user,
    });

    return await this.courseRepo
      .save(newCourse)
      .catch((e) => console.log('course save error', e));
  }

  @Authorized('TEACHER')
  @Mutation(() => Course)
  public async updateCourse(
    @Arg('id') id: number,
    @Arg('values') values: Course,
    @Ctx() ctx
  ): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id, user: ctx.user },
    });

    if (!course) {
      throw new Error(
        "Course not found or you're not authorize to update the course !"
      );
    }
    const updatedCourse = Object.assign(course, values);

    return await this.courseRepo.save(updatedCourse);
  }

  @Mutation(() => Boolean)
  public async deleteCourse(@Arg('id') id: number): Promise<boolean> {
    const course = await this.courseRepo.findOne({ where: { id } });

    if (!course) {
      throw new Error('Course not found !');
    }

    try {
      await this.courseRepo.remove(course);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this course');
    }
  }
}
