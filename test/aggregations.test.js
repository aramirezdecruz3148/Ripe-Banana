const { getActors, getFilms, getStudios, getReviews, getReviewers } = require('./data-helper');
const app = require('../lib/app');
const request = require('supertest');

describe('aggregate tests', () => {
  it('can return a list of the top 10 reviewed films', () => {
    return request(app)
      .get('/api/v1/aggregations/popular-films')
  });
});
