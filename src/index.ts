import 'reflect-metadata';
import { User } from './entity/User';
import { Quiz } from './entity/Quiz';
import { Answer } from './entity/Answer';
import { Upload } from './entity/Upload';
import { Course } from './entity/Course';
import { Question } from './entity/Question';
import { Promotion } from './entity/Promotion';
import { Tag } from './entity/Tag';
import { Evaluation } from './entity/Evaluation';
import { ContactInformation } from './entity/ContactInformation';
import { CourseResolver } from './resolvers/Course';
import { UserResolver } from './resolvers/User';
import { QuizResolver } from './resolvers/Quiz';
import { passwordAuthChecker } from './utils/auth-checker';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import dotenv from 'dotenv';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import { QuestionResolver } from './resolvers/Question';
import { AnswerResolver } from './resolvers/Answer';
import { TagResolver } from './resolvers/Tag';

dotenv.config();

const startServer = async () => {
  await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'ELI',
    entities: [
      User,
      Course,
      Promotion,
      Upload,
      Evaluation,
      ContactInformation,
      Quiz,
      Question,
      Answer,
      Tag,
    ],
    synchronize: true,
    migrations: ['migration/*.ts'],
    cli: {
      migrationsDir: 'migration',
    },
  });

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CourseResolver,
      QuizResolver,
      QuestionResolver,
      AnswerResolver,
      TagResolver,
    ],
    authChecker: passwordAuthChecker,
    nullableByDefault: true,
  });

  const app = Express();
  app.use(cors());
  app.use(cookieParser());
  const server = new ApolloServer({
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
