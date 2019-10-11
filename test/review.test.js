require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Reviewer = require('../lib/models/Reviewer');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');

describe('review routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let reviewer = null;
  let actor = null;
  let studio = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'StudioA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      } })));
    
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Alex',
      dob: '1988-03-14T00:00:00.000Z',
      pob: 'Ventura, CA' })));

    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Coolest Movie',
      studio: studio._id,
      released: 2017,
      cast: [{
        role: 'someone cool',
        actor: actor._id
      }] })));

    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Harry Potter',
      company: 'Ministry of Magic' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a new review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 3,
        reviewer: reviewer._id,
        review: 'this is my review',
        film: film._id,
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 3,
          reviewer: reviewer._id,
          review: 'this is my review',
          film: film._id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  });

  it('can return the 100 most recent reviews', async() => {
    await Promise.all([...Array(101)].map((i) => {
      return Review.create({
        rating: 4,
        reviewer: reviewer._id,
        review: `This movie is AWESOME ${i}`,
        film: film._id,
      });
    }));
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toHaveLength(100);
      });
  });
});
