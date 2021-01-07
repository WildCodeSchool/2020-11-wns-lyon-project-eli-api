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
import {Evaluation} from "./entity/Evaluation";
import {ContactInformation} from "./entity/ContactInformation";
require('dotenv').config()

const { ApolloServer } = require('apollo-server-express')
const Express = require('express');

export const passwordAuthChecker: AuthChecker = async ({ context }: any, roles) => {
    // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    try {
        const token = context.req.headers.authorization.split('Bearer ')[1];
        // console.log('token', token)


        if (token) {
            const manager = getManager();
            const data = decodeJwt(token);
            context.user = await manager.findOneOrFail(User, {id: data.userId});
            console.log('passwordAuthChecker : context.user', context.user)

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
        host: 'db',
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        // database: "ELI",
        // entities: [
        //     User, Course, Promotion, Speciality, Upload, Evaluation, ContactInformation
        // ],
        // synchronize: true,
        // migrations: ["migration/*.ts"],
        // cli: {
        //     "migrationsDir": "migration"
        // }
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
