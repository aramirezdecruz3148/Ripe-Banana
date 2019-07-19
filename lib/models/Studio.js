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
    this.findById(id).select({ name: true, address: true }),  
    this.model('Film').find({ studio: id }).select({ _id: true, title: true })
  ])
    .then(([studio, films]) => ({
      ...studio.toJSON(),
      films
    }));
};

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
