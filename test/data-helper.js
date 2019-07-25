require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seedData = require('./seed-data');

const prepare = arr => JSON.parse(JSON.stringify(arr));

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

let seededActors = null;
let seededFilms = null;
let seededReviews = null;
let seededReviewers = null;
let seededStudios = null;
beforeEach(async() => {
  const { actors, films, reviews, reviewers, studios } = await seedData();
  seededActors = prepare(actors);
  seededFilms = prepare(films);
  seededReviews = prepare(reviews);
  seededReviewers = prepare(reviewers);
  seededStudios = prepare(studios);
});

afterAll(() => {
  return mongoose.connection.close();
});

module.exports = {
  getActors: () => seededActors,
  getFilms: () => seededFilms,
  getReviews: () => seededReviews,
  getReviewers: () => seededReviewers,
  getStudios: () => seededStudios
};

