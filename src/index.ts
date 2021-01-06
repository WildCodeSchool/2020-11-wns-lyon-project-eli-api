import "reflect-metadata";
import {Connection, createConnection, getManager} from "typeorm";
import {AuthChecker, buildSchema} from "type-graphql";
import {decodeJwt} from "./utils/helpers";
import {User} from "./entity/User";
import cors = require('cors');
import cookieParser = require('cookie-parser');
import {UserResolver} from "./resolvers/User";
import {Course} from "./entity/Course";
import {Promotion} from "./entity/Promotion";
import {Speciality} from "./entity/Speciality";
import {Upload} from "./entity/Upload";

const {
    ApolloServer,
    gql,
    AuthenticationError,
} = require('apollo-server-express')
const Express = require('express');

export const passwordAuthChecker: AuthChecker = async ({ context }: any, roles) => {
    // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    try {
        // appSession = cookie.key
        // token = cookie.value
        const token = context.req.cookies.appSession;

        if (token) {
            const manager = getManager();
            const data = decodeJwt(token);
            context.user = await manager.findOneOrFail(User, {id: data.userId});

            /**
             * Here, we can reset the token each request to maintain the user connected
             const newToken = generateJwt({ userId: context.user.id });
             context.res.cookie('appSession', newToken, { maxAge: 60 * 24, httpOnly: true });
             */

            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
};

const startServer = async () => {
    const connexion: Connection = await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "pako",
        password: "rek",
        database: "ELI",
        entities: [
            User, Course, Promotion, Speciality, Upload
        ],
        synchronize: true,
    });

    const schema = await buildSchema({
        resolvers: [UserResolver],
        authChecker: passwordAuthChecker,

    });

    const app = Express()
    app.use(cors());
    app.use(cookieParser());
    const server = new ApolloServer({schema, context: ({ req, res }) => ({ req, res })})

    server.applyMiddleware({app});

    app.listen(4300, () => {
        console.log('server started');
    })
}
startServer()
