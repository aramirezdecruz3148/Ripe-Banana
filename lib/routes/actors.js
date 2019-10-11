const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob, 
      pob, 
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({
        _id: true,
        name: true
      })
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Actor
      .findByIdWithFilms(req.params.id)
      .then(actorWithFilms => res.send(actorWithFilms))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Actor
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select({ name: true, dob: true, pob: true })
      .then(updatedActor => res.send(updatedActor))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Actor
      .findByIdWithFilms(req.params.id)
      .then(studio => {
        if(studio.films.length === 0) {
          Actor
            .findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio));
        } else {
          const err = new Error('Cannot delete this actor');
          err.status = 409;
          next(err);
        }
      })
      .catch(next);
  });
