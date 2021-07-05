import { AuthChecker } from 'type-graphql';
import { getManager } from 'typeorm';
import { dataType, decodeJwt } from './helpers';
import { User } from '../entity/User';

export const passwordAuthChecker: AuthChecker = async (
  //eslint-disable-next-line
  { context }: any,
  roles
) => {
  console.log('context passAuth', context);
  // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  try {
    const token = context.req.headers.authorization.split('Bearer ')[1];

    if (token) {
      const manager = getManager();
      // what happen if string ?
      const data: dataType | string = decodeJwt(token);
      // 6 next lines aren't ok : need to manage string case
      let userID: number;
      if (typeof data === 'string') {
        userID = +data;
      } else {
        userID = data.userId;
      }
      const connectedUser = await manager.findOneOrFail(User, {
        id: +userID,
      });
      // const { id, email, role } = connectedUser;
      context.user = connectedUser;

      if (roles.length === 0) {
        return connectedUser !== undefined;
      }
      return roles.includes(connectedUser.role);
    }
    return false;
  } catch {
    return false;
  }
};
