const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema({
  exercise: {
    type: String,
    enum: [
      'WALKING',
      'RUNNING',
      'CYCLING',
      'INDOOR_CYCLING',
      'DUMBBELLS',
      'DANCING',
      'PILATES',
      'YOGA',
      'ZUMBA',
      'TREADMILL',
      'ELLIPTICAL',
      'JUMP_THE_ROPE',
    ],
  },
  time: { type: Number, default: null },
  weight: { type: Number, default: null },
  repeats: { type: Number, default: null },
  steps: { type: Number, default: null },
  jumps: { type: Number, default: null },
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  date: { type: Date, default: null },
});

module.exports = model('exercise', exerciseSchema);
