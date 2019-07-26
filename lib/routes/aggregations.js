const { Router } = require('express');
const Film = require('../models/Film');
const Actor = require('../models/Actor');

module.exports = Router()
  .get('/top-rated', (req, res, next) => {
    Film
      .highestAvgRatingPerFilm()
      .then(ratedMovies => res.send(ratedMovies))
      .catch(next);
  })

  .get('/top-actors', (req, res, next) => {
    Actor
      .actorsInMostFilms()
      .then(actors => res.send(actors))
      .catch(next);
  });
