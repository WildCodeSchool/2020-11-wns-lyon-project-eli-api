import {AuthChecker} from "type-graphql";
import {getManager} from "typeorm";
import {decodeJwt} from "./helpers";
import {User} from "../entity/User";

export const passwordAuthChecker: AuthChecker = async ({context}: any, roles) => {
    // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    try {
        const token = context.req.headers.authorization.split('Bearer ')[1];

        if (token) {
            const manager = getManager();
            const data = decodeJwt(token);
            const connectedUser = await manager.findOneOrFail(User, {id: data.userId});
            // const { id, email, role } = connectedUser;
            context.user = connectedUser ;

            if (roles.length === 0) {
                return connectedUser !== undefined;
            }
            if (roles.includes(connectedUser.role)) {
                return true;
            }
            return false
        }
        return false
    } catch {
        return false;
    }
};