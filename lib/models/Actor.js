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

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
