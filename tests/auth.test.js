const app = require('../app');
const request = require('supertest');
require('./mongodb_helper');
const User = require('../user/schema');

describe('/auth', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST, when email and password are provided', () => {
    it('shows a successful response, 200', async () => {
      let response = await request(app)
        .post('/auth/register')
        .send({ email: 'joe@example.com', password: '1234' });
      expect(response.statusCode).toBe(200);
    });
  });
});
