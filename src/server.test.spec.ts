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
  let query, mutate, token;

  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
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
      logging: false,
    });
    const testClient = createTestClient((await getApolloServer()) as any);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  describe('create user damien', () => {
    it('create 1 user damien', async () => {
      const response = await mutate({
        mutation: `
          mutation  {
            createUser(values: {
              email: "damien.bregieiro@gmail.com",
              password: "damien",
              firstName : "Damien",
              lastName: "Da Silva Bregieiro",
              role: "TEACHER"
            }){
              email,
              firstName
            }
          }
        `,
      });

      expect(response.data).toMatchObject({
        createUser: {
          email: 'damien.bregieiro@gmail.com',
          firstName: 'Damien',
        },
      });
    });
  });

  describe('update user 1', () => {
    it('update user with data', async () => {
      const response = await mutate({
        mutation: `
          mutation {
            updateUser(
              values: {
                email: "brice@gmail.com"
                firstName: "Brice"
                lastName: "Test"
              },
              id: 1
            ) {
              email
              firstName
              lastName
            }
          }
        `,
      });

      expect(response.data).toMatchObject({
        updateUser: {
          email: 'brice@gmail.com',
          firstName: 'Brice',
          lastName: 'Test',
        },
      });
    });
  });

  describe('get user by id', () => {
    it('get user 1 => brice', async () => {
      const response = await query({
        query: `
          query {
            getUser(id: 1) {
              email
            }
          }        
        `,
      });

      expect(response.data).toMatchObject({
        getUser: {
          email: 'brice@gmail.com',
        },
      });
    });
  });

  describe('Authenticate', () => {
    it('authenticate brice', async () => {
      const response = await mutate({
        mutation: `
          mutation{
            authenticate(password: "damien", email: "brice@gmail.com") {
              token
              user {
                email
                role
              }
            }
          }
        `,
      });

      expect(response.data.authenticate.user).toMatchObject({
        email: 'brice@gmail.com',
        role: 'TEACHER',
      });
    });
  });

  describe('getCourses query', () => {
    it('read courses ', async () => {
      const response = await query({
        query: `
          query {
            getCourses {
              title,
              subtitle,
              content
            }
          }
        `,
      });

      expect(response.data).toMatchObject({
        getCourses: [],
      });
    });
  });

  describe('getCourse id query', () => {
    it('read course by id ', async () => {
      const response = await query({
        query: `
          query {
            getCourse(id: 1) {
              title,
              subtitle,
              content
            }
          }
        `,
      });

      expect(response.data).toMatchObject({ getCourse: null });
    });
  });

  describe('delete course by id', () => {
    it('delete course 1', async () => {
      const response = await mutate({
        mutation: `
          mutation {
            deleteCourse(id: 1)
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
            deleteUser(id: 1)
          }
        `,
      });

      expect(response.data).toMatchObject({
        deleteUser: true,
      });
    });
  });
});
