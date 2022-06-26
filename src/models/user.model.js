const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    default: null,
  },
  goal: { type: Number, default: null },
  weight: { type: Number, default: null },
  height: { type: Number, default: null },
  weight_setting: { type: Boolean, default: true },
  height_setting: { type: Boolean, default: true },
  exercise_setting: { type: Boolean, default: true },
});

module.exports = model('user', userSchema);
