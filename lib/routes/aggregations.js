const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .get('/top-rated', (req, res, next) => {
    Film
      .highestAvgRatingPerFilm()
      .then(ratedMovies => res.send(ratedMovies))
      .catch(next);
  });
