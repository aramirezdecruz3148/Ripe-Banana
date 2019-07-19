const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name, 
      address
    } = req.body;

    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({
        _id: true,
        name: true
      })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Studio
      .findByIdWithFilms(req.params.id)
      .then(studioAndId => res.send(studioAndId))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Studio
      .findByIdWithFilms(req.params.id)
      .then(studio => {
        if(studio.films.length === 0) {
          Studio
            .findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio));
        } else {
          const err = new Error('Cannot delete this studio');
          err.status = 409;
          next(err);
        }
      })
      .catch(next);
  });
