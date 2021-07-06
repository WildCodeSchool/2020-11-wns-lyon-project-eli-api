import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import { passwordAuthChecker } from './utils/auth-checker';

import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const startServer = async () => {
  try {
    console.log('=================');

    await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'ELI',
      entities: [__dirname + './src/entity/*.{ts,js}'],
      synchronize: true,
      logging: true,
    });

    console.log('Synchronized');

    const schema = await buildSchema({
      resolvers: [__dirname + './src/resolvers/*.{ts,js}'],
      authChecker: passwordAuthChecker,
      nullableByDefault: true,
    });

    console.log('Schematized');

    const app = Express();
    app.use(cors());
    app.use(cookieParser());
    const server = new ApolloServer({
      schema,
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    });

    console.log('Expressed');

    server.applyMiddleware({ app });

    app.listen(4300, () => {
      console.log('Server started');

      console.log('=================');
    });
  } catch (err) {
    console.error(err);
  }
};

startServer().catch((e) => {
  console.log(e);
});
