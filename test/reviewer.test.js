require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

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
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewer));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual({ name: reviewer.name, _id: reviewer._id, company: reviewer.company });
        });
      });
  });

  it('can get a reviewer back by id', async() => {
    const reviewer = await Reviewer.create({
      name: 'Harry Potter',
      company: 'Ministry of Magic'
    });

    const studio = await Studio.create({
      name: 'StudioA',
      address: {
        city: 'Portland',
        state: 'Oregon',
        country: 'USA'
      }
    });

    const actor = await Actor.create({
      name: 'Alex',
      dob: '1988-03-14T00:00:00.000Z',
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

    const review = await Review.create({
      rating: 4,
      reviewer: reviewer._id,
      review: 'this is a review',
      film: film._id,
    });

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Harry Potter',
          company: 'Ministry of Magic',
          reviews: [{
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            film: { 
              _id: film._id.toString(), 
              title: film.title 
            }
          }]
        });
      });
  });

  it('can update a reviewer by id', async() => {
    const reviewer = await Reviewer.create({
      name: 'Harry Potter',
      company: 'Ministry of Magic'
    });

    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({
        name: 'Meany Head',
        company: 'Poopy'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Meany Head',
          company: 'Poopy'
        });
      });
  });
});

