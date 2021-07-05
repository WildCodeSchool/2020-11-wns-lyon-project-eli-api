import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Course } from '../entity/Course';
import { Speciality } from '../entity/Speciality';
import { getRepository } from 'typeorm';

@Resolver(Course)
export class CourseResolver {
  private courseRepo = getRepository(Course);
  private specialityRepo = getRepository(Speciality);

  @Query(() => [Course])
  public async getCourses(): Promise<Course[]> {
    return await this.courseRepo.find({ relations: ['speciality'] });
  }

  @Query(() => Course)
  public async getCourse(@Arg('id') id: number): Promise<Course | void> {
    return await this.courseRepo.findOne({ where: { id } });
  }

  @Authorized('TEACHER')
  @Mutation(() => Course)
  public async createCourse(
    @Arg('values', () => Course) values: Course,
    // eslint-disable-next-line
    @Ctx() ctx
  ): Promise<Course | void> {
    try {
      const { name, description } = values.speciality;
      const { title, intro, subtitle, content, logo } = values;

      let speciality;
      const specialityExist = await this.specialityRepo.findOne({
        where: { name },
      });

      console.log('This exist :', specialityExist);

      if (specialityExist == undefined) {
        speciality = new Speciality();
        speciality.name = name;
        speciality.description = description;
        speciality.logo = values.speciality.logo;

        await this.specialityRepo.save(speciality);
      } else {
        speciality = specialityExist;
      }

      const course = new Course();
      course.title = title;
      course.intro = intro;
      course.subtitle = subtitle;
      course.content = content;
      course.logo = logo;
      course.user = ctx.user;
      course.speciality = speciality;

      return await this.courseRepo.save(course);
    } catch (err) {
      console.log('course save error', err);
    }
  }

  @Authorized('TEACHER')
  @Mutation(() => Course)
  public async updateCourse(
    @Arg('id') id: number,
    @Arg('values') values: Course,
    //eslint-disable-next-line
    @Ctx() ctx: any
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
