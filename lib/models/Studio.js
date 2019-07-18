const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    }
  }
});

studioSchema.statics.findByIdWithFilms = function(id) {
  return Promise.all([
    this.findById(id),
    this.model('Film').find({ studio: id })
  ])
    .then(([studio, films]) => ({
      ...studio.toJSON(),
      films
    }));
};

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
