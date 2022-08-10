const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('oauth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await (await request.agent(app).get('api/v1/github/callback?code=42')).redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'im_not_real',
      email: 'fake_person@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
