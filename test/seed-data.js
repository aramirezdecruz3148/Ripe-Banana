const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');
const chance = require('chance').Chance();

module.exports = async({ actors = 50, films = 100, reviews = 100, reviewers = 50, studios = 25 } = { actors: 50, films: 100, reviews: 100, reviewers: 50, studios: 25 }) => {
  const createdActors = await Actor.create(
    [...Array(actors)].map(() => ({
      name: chance.name(),
      dob: chance.date(),
      pob: chance.state()
    }))
  );

  const createdStudios = await Studio.create(
    [...Array(studios)].map(() => ({
      name: chance.name(),
      address: { city: chance.city(), state: chance.state(), country: chance.country() }
    }))
  );

  const createdFilms = await Film.create(
    [...Array(films)].map(() => ({
      title: chance.sentence(),
      studio: chance.pickone(createdStudios)._id,
      released: chance.date(),
      cast: [{ role: chance.name(), actor: chance.pickone(createdActors) }, { role: chance.name(), actor: chance.pickone(createdActors) }, { role: chance.name(), actor: chance.pickone(createdActors) }]
    }))   
  );

  const createdReviewers = await Reviewer.create(
    [...Array(reviewers)].map(() => ({
      name: chance.name(),
      company: chance.company()
    }))
  );

  const createdReviews = await Review.create(
    [...Array(reviews)].map(() => ({
      rating: chance.prime({ min: 1, max: 5 }),
      reviewer: chance.pickone(createdReviewers),
      review: chance.letter(),
      film: chance.pickone(createdFilms)
    }))
  );

  return {
    actors: createdActors,
    films: createdFilms,
    reviews: createdReviews,
    reviewers: createdReviewers,
    studios: createdStudios
  };
};
