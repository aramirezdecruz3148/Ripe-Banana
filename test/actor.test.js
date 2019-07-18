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

  it('can get all actors', async() => {
    const actor = await Actor.create([{
      name: 'Alex',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Ventura, CA'
    },
    {
      name: 'Lava',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Japan'
    }]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actor));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({ name: actor.name, _id: actor._id });
        });
      });
  });

  it('can get a actor back by id', async() => {
    const actor = await Actor.create({
      name: 'Alex',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Ventura, CA'
    });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Alex',
          dob: '1988-03-14T00:00:00.000Z',
          pob: 'Ventura, CA',
          _id: expect.any(String)
        });
      });
  });

  it('can update an actor by id', async() => {
    const actor = await Actor.create({
      name: 'Alex',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Ventura, CA'
    });

    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({
        name: 'Lava',
        dob: '1988-03-14T00:00:00.000Z',
        pob: 'Japan'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Lava',
          dob: '1988-03-14T00:00:00.000Z',
          pob: 'Japan'
        });
      });
  });

  it('can delete an actor by id', async() => {
    const actor = await Actor.create({
      name: 'Lava',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Japan'
    });

    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body.name).toEqual('Lava');
      });
  });
});
