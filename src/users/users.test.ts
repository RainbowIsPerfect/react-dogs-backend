import request from 'supertest';
import { app } from '..';

const existingUserMock = {
  email: 'andrey-smollin1@gmail.com',
  password: '666666',
};

const existingUserResponseMock = {
  data: {
    _id: '646ce7af20628ac2c5b5bfaa',
    email: 'andrey-smollin1@gmail.com',
    name: 'Andrey',
    avatar:
      'https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67',
    about: 'Developer',
    group: 'group-11',
  },
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDZjZTdhZjIwNjI4YWMyYzViNWJmYWEiLCJpYXQiOjE2ODQ4NTkxMjR9.A2f7Zw0ksck4Q6chyUsgPRFHJw5VSBae7ElfkG58mZQ',
};

const notExistingUserMock = {
  email: 'not-existing@gmail.com',
  password: '666666',
};

describe('POST /users/signin', () => {
  it('responds with status 200 if user exists in database', async () => {
    request(app)
      .post('/users/signin')
      .send(existingUserMock)
      .expect(200, existingUserResponseMock);
  });

  it("responds with status 404 if user doesn't exist", async () => {
    request(app).post('/users/signin').send(notExistingUserMock).expect(404, {
      message: 'Wrong email or password',
      statusCode: 404,
    });
  });

  it('responds with status 400 if email field is incorrect', async () => {
    request(app).post('/users/signin').send(notExistingUserMock).expect(400, {
      message: 'Invalid email in "email" field',
      statusCode: 400,
    });
  });
});
