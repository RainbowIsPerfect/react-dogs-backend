import request from 'supertest';
import { startServer } from '..';
import { client } from '../db';

describe('app', () => {
  // beforeAll(async () => {
  //   await client.connect();
  // });

  // afterAll(async () => {
  //   await connection.close();
  // });

  it('create product', () => {
    request(startServer)
      .get('/ping')
      // .set('Accept', 'application/json')
      .expect(200, {
        message: 'Server is OK',
      });
  });
});
