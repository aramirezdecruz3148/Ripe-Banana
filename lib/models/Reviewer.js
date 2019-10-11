const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
});

reviewerSchema.statics.findByIdWithReviews = function(id) {
  return Promise.all([
    this.findById(id).select({ _id: true, name: true, company: true }),
    this.model('Review').find({ reviewer: id }).populate('film', { _id: true, title: true }).select({ _id: true, rating: true, review: true })
  ])
    .then(([reviewer, reviews]) => ({
      ...reviewer.toJSON(),
      reviews
    }));
};

const Reviewer = mongoose.model('Reviewer', reviewerSchema);

module.exports = Reviewer;
