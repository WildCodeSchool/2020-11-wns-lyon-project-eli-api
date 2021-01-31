import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import { User } from './entity/User';
import { UserResolver } from './resolvers/User';
import { Course } from './entity/Course';
import { Promotion } from './entity/Promotion';
import { Speciality } from './entity/Speciality';
import { Upload } from './entity/Upload';
import { Evaluation } from './entity/Evaluation';
import { ContactInformation } from './entity/ContactInformation';
import { CourseResolver } from './resolvers/Course';
import { passwordAuthChecker } from './utils/auth-checker';

import { getApolloServer } from './getApolloServer';

import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const startServer = async () => {
  await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: 'root',
    password: '',
    database: 'ELI_test',
    entities: [
      User,
      Course,
      Promotion,
      Speciality,
      Upload,
      Evaluation,
      ContactInformation,
    ],
    synchronize: true,
    migrations: ['migration/*.ts'],
    cli: {
      migrationsDir: 'migration',
    },
  });

  const server = getApolloServer();

  const app = Express();
  app.use(cors());
  app.use(cookieParser());

  (await server).applyMiddleware({ app });

  app.listen(4300, () => {
    console.log('server started');
  });
};

startServer().catch((e) => {
  console.log(e);
});
