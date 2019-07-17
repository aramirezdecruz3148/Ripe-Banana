require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create an actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Alex',
        dob: '1988-03-14',  
        pob: 'Ventura, CA'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Alex',
          dob: '1988-03-14T00:00:00.000Z',  
          pob: 'Ventura, CA',
          __v: 0
        });
      });
  });
});
