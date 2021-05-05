"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User_1 = require("./entity/User");
const User_2 = require("./resolvers/User");
const Course_1 = require("./entity/Course");
const Promotion_1 = require("./entity/Promotion");
const Speciality_1 = require("./entity/Speciality");
const Upload_1 = require("./entity/Upload");
const Evaluation_1 = require("./entity/Evaluation");
const ContactInformation_1 = require("./entity/ContactInformation");
const Course_2 = require("./resolvers/Course");
const auth_checker_1 = require("./utils/auth-checker");
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const startServer = async () => {
    await typeorm_1.createConnection({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'ELI',
        entities: [
            User_1.User,
            Course_1.Course,
            Promotion_1.Promotion,
            Speciality_1.Speciality,
            Upload_1.Upload,
            Evaluation_1.Evaluation,
            ContactInformation_1.ContactInformation,
        ],
        synchronize: true,
        migrations: ['migration/*.ts'],
        cli: {
            migrationsDir: 'migration',
        },
    });
    const schema = await type_graphql_1.buildSchema({
        resolvers: [User_2.UserResolver, Course_2.CourseResolver],
        authChecker: auth_checker_1.passwordAuthChecker,
        nullableByDefault: true,
    });
    const app = express_1.default();
    app.use(cors());
    app.use(cookieParser());
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });
    server.applyMiddleware({ app });
    app.listen(4300, () => {
        console.log('server started');
    });
};
startServer().catch((e) => {
    console.log(e);
});
