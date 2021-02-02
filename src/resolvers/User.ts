import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AuthResult } from '../entity/AuthResult';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import { generateJwt } from '../utils/helpers';
import { getRepository } from 'typeorm';

@Resolver(User)
export class UserResolver {
  private userRepo = getRepository(User);

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  @Query(() => User)
  @Authorized()
  public async authenticatedUser(@Ctx() ctx): Promise<User> {
    console.log();
    return ctx.user;
  }

  // @Query(() => User)
  //@Authorized()
  // public async getUser(@Ctx() ctx): Promise<User> {
  //     console.log(ctx.user)
  //     return ctx.user;
  // }

  @Mutation(() => AuthResult, { nullable: true })
  public async authenticate(
    @Arg('email') email: string,
    @Arg('password') password: string
    // @Ctx() ctx
  ): Promise<AuthResult> {
    const user = await this.userRepo.findOneOrFail({ email });

    if (user && (await bcrypt.compare(password, user.password)) === true) {
      const token = generateJwt({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });

      return { token, user };
    } else {
      return {};
    }
  }

  @Mutation(() => User)
  public async createUser(
    @Arg('values', () => User) values: User
  ): Promise<User | void> {
    const hash = await UserResolver.hashPassword(values.password);
    const user = this.userRepo.create({ ...values, password: hash });

    return await this.userRepo
      .save(user)
      .catch((err) => console.log('save error', err));
  }

  @Mutation(() => User)
  public async updateUser(
    @Arg('id') id: number,
    @Arg('values') values: User
    // @Ctx() ctx
  ): Promise<User> {
    const user: User | undefined = await this.userRepo.findOne({
      where: { id: id },
    });

    console.log('updateUser', user);

    if (!user) {
      throw new Error(
        "User not found or you're not authorize to update them !"
      );
    }
    const updatedUser: User = Object.assign(user, values);

    return await this.userRepo.save(updatedUser);
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Arg('id') id: number): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found !');
    }

    try {
      await this.userRepo.remove(user);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this user');
    }
  }
}
