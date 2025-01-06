import supertest from 'supertest';
import httpStatus from 'http-status';
import app from '../src/app';

const request = supertest(app);

describe('Basic', () => {
  test('Mic check', async () => {
    const response = await request.get('/v1/').send();

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.message).toBe('It Works');
  });
});
