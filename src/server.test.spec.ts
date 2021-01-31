import { createTestClient } from 'apollo-server-testing';
import { createConnection } from 'typeorm';
import { getApolloServer } from './getApolloServer';

import { User } from './entity/User';
import { Course } from './entity/Course';
import { Promotion } from './entity/Promotion';
import { Speciality } from './entity/Speciality';
import { Upload } from './entity/Upload';
import { Evaluation } from './entity/Evaluation';
import { ContactInformation } from './entity/ContactInformation';

describe('Apollo server', () => {
  let query, mutate;

  beforeEach(async () => {
    await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: 'root',
      password: '',
      database: 'eli_test',
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
    const testClient = createTestClient(await getApolloServer());
    query = testClient.query;
    mutate = testClient.mutate;
  });

  describe('getCourses query', () => {
    it('read courses ', async () => {
      const response = await query({
        query: `
          query {
            getCourses {
              title,
              subtitle
            }
          }
        `,
      });

      expect(response.data).toMatchObject({
        getCourses: [
          {
            title: 'test',
            subtitle: 'test test',
          },
          {
            title: 'test 2',
            subtitle: 'test test 2',
          },
        ],
      });
    });
  });

  describe('getCourse id query', () => {
    it('read course id ', async () => {
      const response = await query({
        query: `
          query {
            getCourse(id: 2) {
              title,
              subtitle,
              content
            }
          }
        `,
      });

      expect(response.data).toMatchObject({
        getCourse: {
          title: 'test 2',
          subtitle: 'test test 2',
          content: 'test test test 2',
        },
      });
    });
  });
});
