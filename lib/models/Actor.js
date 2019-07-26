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

actorSchema.statics.actorsInMostFilms = function() {
  return this.aggregate([
    { $lookup: { from: 'films', localField: '_id', foreignField: 'cast.actor', as: 'films' } }, 
    { $project: { name: true, 'films.cast.actor': true } }, 
    { $unwind: { path: '$films' } }, 
    { $group: { _id: '$_id', films: { $sum: 1 }, name: { $addToSet: '$name' } } }, 
    { $unwind: { path: '$name' } }, 
    { $sort: { films: -1 } }, 
    { $limit: 15 }
  ]);
};

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
