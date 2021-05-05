"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordAuthChecker = void 0;
const typeorm_1 = require("typeorm");
const helpers_1 = require("./helpers");
const User_1 = require("../entity/User");
exports.passwordAuthChecker = async ({ context }, roles) => {
    console.log('context passAuth', context);
    // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    try {
        const token = context.req.headers.authorization.split('Bearer ')[1];
        if (token) {
            const manager = typeorm_1.getManager();
            // what happen if string ?
            const data = helpers_1.decodeJwt(token);
            // 6 next lines aren't ok : need to manage string case
            let userID;
            if (typeof data === 'string') {
                userID = +data;
            }
            else {
                userID = data.userId;
            }
            const connectedUser = await manager.findOneOrFail(User_1.User, {
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
    }
    catch (_a) {
        return false;
    }
};
