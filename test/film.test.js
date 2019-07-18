require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let actor1 = null;
  let actor2 = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ 
      name: 'StudioA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      } })));

    actor1 = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Alex',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Ventura, CA'
    })));

    actor2 = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Lava',
      dob: '1974-04-24T00:00:00.000Z',
      pob: 'Ventura, CA'
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'Coolest Movie',
        studio: studio._id,
        released: 2017,
        cast: [{
          role: 'someone cool',
          actor: actor1._id
        },
        {
          role: 'someone else cool',
          actor: actor2._id
        }]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Coolest Movie',
          studio: studio._id,
          released: 2017,
          cast: [{
            _id: expect.any(String),
            role: 'someone cool',
            actor: actor1._id
          },
          { _id: expect.any(String),
            role: 'someone else cool',
            actor: actor2._id
          }],
          __v: 0
        });
      });
  });
});
