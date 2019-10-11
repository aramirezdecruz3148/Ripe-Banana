require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

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

  it('can get all films', async() => {
    const film = JSON.parse(JSON.stringify(await Film.create([{
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
    },
    {
      title: 'Another Cool Movie',
      studio: studio._id,
      released: 2019,
      cast: [{
        role: 'someone really cool',
        actor: actor1._id
      },
      {
        role: 'someone else super cool',
        actor: actor2._id
      }]
    }]
    )));

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(film));
        filmsJSON.forEach(film => {
          expect(res.body).toContainEqual({ title: film.title, _id: film._id, released: film.released, studio: { _id: studio._id, name: studio.name } });
        });
      });
  });

  it('can get a film back by id', async() => {
    const film = await Film.create({
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
    });

    const reviewer = await Reviewer.create({
      name: 'Harry Potter',
      company: 'Ministry of Magic'
    });

    const review = await Review.create({
      rating: 3,
      reviewer: reviewer._id,
      review: 'this is my review',
      film: film._id
    });

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: 'Coolest Movie',
          studio: { _id: studio._id, name: studio.name },
          released: 2017,
          cast: [{
            _id: expect.any(String),
            role: 'someone cool',
            actor: { _id: actor1._id, name: actor1.name }, 
          },
          {
            _id: expect.any(String),
            role: 'someone else cool',
            actor: { _id: actor2._id, name: actor2.name },
          }],
          reviews: [{ _id: review._id.toString(), rating: review.rating, review: review.review, reviewer: { _id: reviewer._id.toString(), name: reviewer.name } }]
        });
      });
  });

  it('can delete a film by id', async() => {
    const film = await Film.create({
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
    });

    return request(app)
      .delete(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body.title).toEqual('Coolest Movie');
      });
  });
});
