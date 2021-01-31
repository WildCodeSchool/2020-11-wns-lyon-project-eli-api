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
    if (
      query == null ||
      (query == undefined && mutate == null) ||
      mutate == undefined
    ) {
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
    }
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
            getCourse(id: 4) {
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

  describe('delete course by id', () => {
    it('delete course 2', async () => {
      const response = await mutate({
        mutation: `
          mutation {
            deleteCourse(id: 5)
          }
        `,
      });

      expect(response.data).toMatchObject({
        deleteCourse: null,
      });
    });
  });

  describe('delete user by id', () => {
    it('delete user 1', async () => {
      const response = await mutate({
        mutation: `
          mutation {
            deleteUser(id: 2)
          }
        `,
      });

      expect(response.data).toMatchObject({
        deleteUser: null,
      });
    });
  });
});
