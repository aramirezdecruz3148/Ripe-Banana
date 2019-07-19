require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('studio routes', () => {
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
            country: 'USA',
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

    const actor = await Actor.create({
      name: 'Lava',
      dob: '1974-04-24T00:00:00.000Z',
      pob: 'Ventura, CA'
    });

    const film = await Film.create({
      title: 'Coolest Movie',
      studio: studio._id,
      released: 2017,
      cast: [{
        role: 'someone cool',
        actor: actor._id
      }]
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
          films: [{ _id: film.id, title: film.title }]
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

    const actor = await Actor.create({
      name: 'Lava',
      dob: '1974-04-24T00:00:00.000Z',
      pob: 'Ventura, CA'
    });

    const film = await Film.create({
      title: 'Coolest Movie',
      studio: studio._id,
      released: 2017,
      cast: [{
        role: 'someone cool',
        actor: actor._id
      }]
    });

    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.status).toEqual(409);
      });
  });
});
