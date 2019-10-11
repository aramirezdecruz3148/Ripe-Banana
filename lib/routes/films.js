const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      title,
      studio,
      released,
      cast
    } = req.body;

    Film
      .create({ title, studio, released, cast })
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film
      .find()
      .populate('studio', { name: true, _id: true })
      .select({
        __v: false,
        cast: false,
      })
      .then(films => res.send(films))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Film  
      .findByIdWithReviews(req.params.id)
      .then(filmWithReviews => res.send(filmWithReviews))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film  
      .findByIdAndDelete(req.params.id)
      .then(film => res.send(film))
      .catch(next);
  });
