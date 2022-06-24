const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema({
  exercise: {
    type: String,
    time: { type: Number, default: null },
    weight: { type: Number, default: null },
    repetitions: { type: Number, default: null },
    steps: { type: Number, default: null },
    jumps: { type: Number, default: null },
  },
});

module.exports = model('exercise', exerciseSchema);
