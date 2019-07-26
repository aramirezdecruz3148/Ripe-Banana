const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio',
    required: true
  },
  released: {
    type: Number,
    required: true,
    maxlength: 4
  },
  cast: [{
    role: {
      type: String
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
      required: true
    }
  }]
});

filmSchema.statics.findByIdWithReviews = function(id) {
  return Promise.all([
    this.findById(id).select({ __v: false,  _id: false }).populate('studio', { name: true, _id: true }).populate('cast.actor', { name: true, _id: true }),
    this.model('Review').find({ film: id }).populate('reviewer', { _id: true, name: true }).select({ _id: true, rating: true, review: true })
  ])
    .then(([film, reviews]) => ({
      ...film.toJSON(),
      reviews
    }));
};

filmSchema.statics.highestAvgRatingPerFilm = function() {
  return this.aggregate([
    { $lookup: { from: 'reviews', localField: '_id', foreignField: 'film', as: 'reviewRating' } }, 
    { $project: { title: true, reviewAverage: { $avg: '$reviewRating.rating' } } }, 
    { $sort: { reviewAverage: -1 } }, 
    { $limit: 10 }
  ]);
};

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
