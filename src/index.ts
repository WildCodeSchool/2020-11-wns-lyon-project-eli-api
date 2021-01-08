import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {buildSchema} from "type-graphql";
import cors = require('cors');
import cookieParser = require('cookie-parser');
import {User} from "./entity/User";
import {UserResolver} from "./resolvers/User";
import {Course} from "./entity/Course";
import {Promotion} from "./entity/Promotion";
import {Speciality} from "./entity/Speciality";
import {Upload} from "./entity/Upload";
import {Evaluation} from "./entity/Evaluation";
import {ContactInformation} from "./entity/ContactInformation";
import {CourseResolver} from "./resolvers/Course";
import { passwordAuthChecker } from "./utils/auth-checker"

const { ApolloServer } = require('apollo-server-express')
const Express = require('express');
require('dotenv').config()


const startServer = async () => {
    const connexion: Connection = await createConnection({
        type: "mysql",
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: "ELI",
        entities: [
            User, Course, Promotion, Speciality, Upload, Evaluation, ContactInformation
        ],
        synchronize: true,
        migrations: ["migration/*.ts"],
        cli: {
            "migrationsDir": "migration"
        }
    });

    const schema = await buildSchema({
        resolvers: [UserResolver, CourseResolver],
        authChecker: passwordAuthChecker,

    });

    const app = Express()
    app.use(cors());
    app.use(cookieParser());
    const server = new ApolloServer({schema, context: ({req, res}) => ({req, res})})

    server.applyMiddleware({app});

    app.listen(4300, () => {
        console.log('server started');
    })
}
startServer()
    .catch((e) => {
        console.log(e)
    });
