const { getFilms } = require('./data-helper');
const app = require('../lib/app');
const request = require('supertest');

describe('aggregate tests', () => {
  it('can return the top 10 highest average rated films', () => {
    getFilms();
    return request(app)
      .get('/api/v1/aggregations/top-rated')
      .then(res => {
        expect(res.body.length).toEqual(10);
      });
  });
});
