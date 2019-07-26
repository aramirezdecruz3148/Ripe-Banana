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

  it('can return the 15 actors who are in the most films', () => {
    return request(app)
      .get('/api/v1/aggregations/top-actors')
      .then(res => {
        expect(res.body.length).toEqual(15);
        expect(res.body[0].films).toBeGreaterThan(res.body[10].films);
      });
  });
});
