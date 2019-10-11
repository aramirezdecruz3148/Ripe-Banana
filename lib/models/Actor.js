const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true
  },
  dob: {
    type: Date
  },
  pob: {
    type: String
  }
});

actorSchema.statics.findByIdWithFilms = function(id) {
  return Promise.all([
    this.findById(id).select({ name: true, dob: true, pob: true }),
    this.model('Film').find({ 'cast.actor': id }).select({ _id: true, title: true, released: true })
  ])
    .then(([actor, films]) => ({
      ...actor.toJSON(),
      films
    }));
};

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
