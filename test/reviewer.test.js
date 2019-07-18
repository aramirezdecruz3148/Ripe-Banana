require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Studio');

describe('reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'Harry Potter',
        company: 'Ministry of Magic'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Harry Potter',
          company: 'Ministry of Magic',
          __v: 0
        });
      });
  });

  it('can get all reviewers', async() => {
    const reviewer = await Reviewer.create([{
      name: 'Harry Potter',
      company: 'Ministry of Magic'
    },
    {
      name: 'Dirt',
      company: 'Talk too much'
    }]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewer));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual({ name: reviewer.name, _id: reviewer._id, company: reviewer.company });
        });
      });
  });
});

