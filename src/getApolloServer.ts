import { UserResolver } from './resolvers/User';
import { CourseResolver } from './resolvers/Course';
import { passwordAuthChecker } from './utils/auth-checker';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

export async function getApolloServer(): Promise<ApolloServer> {
  const schema = await buildSchema({
    resolvers: [UserResolver, CourseResolver],
    authChecker: passwordAuthChecker,
    nullableByDefault: true,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  return server;
}
