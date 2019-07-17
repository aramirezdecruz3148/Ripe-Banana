require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

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

  it('can create a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({
        name: 'StudioA',
        address: {
          city: 'Portland',
          state: 'Oregon',
          country: 'USA'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'StudioA',
          address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
          },
          __v: 0
        });
      });
  });

  it('can get all studios', async() => {
    const studio = await Studio.create([{
      name: 'StudioA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    },
    {
      name: 'StudioB',
      address: {
        city: 'Bend',
        state: 'Oregon',
        country: 'USA'
      },
    }]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studio));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });

  it('can get a studio back by id', async() => {
    const studio = await Studio.create({
      name: 'StudioA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    });

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'StudioA',
          address: {
            city: 'Portland',
            state: 'Oregon',
            country: 'USA'
          },
          __v: 0
        });
      });
  });

  it('can delete a studio by id', async() => {
    const studio = await Studio.create({
      name: 'StudioA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    });

    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body.name).toEqual('StudioA');
      });
  });
});
