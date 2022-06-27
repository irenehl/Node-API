/* eslint-disable no-underscore-dangle */
const User = require('../../models/user.model');
const Exercise = require('../../models/exercise.model');

const ExerciseController = {
  register: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });

      const newExercise = new Exercise({
        exercise: req.body.exercise,
        weight: req.body.weight,
        time: req.body.time,
        repeats: req.body.repeats,
        date: req.body.date,
        steps: req.body.steps,
        jumps: req.body.jumps,
        user,
      });

      await newExercise.save();

      return res.status(200).json({ message: 'exercise registered successfully' });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },

  updateExercise: async (req, res) => {
    try {
      const {
        exercise, weight, time, repeats, date, steps, jumps,
      } = req.body;

      const { id } = req.params;

      let actualExercise = await Exercise.findOne({ _id: id });

      actualExercise = {
        exercise: exercise || req.body.exercise,
        weight: weight || req.body.weight,
        time: time || req.body.time,
        repeats: repeats || req.body.repeats,
        date: date || req.body.date,
        steps: steps || req.body.steps,
        jumps: jumps || req.body.jumps,
      };

      await Exercise.findOneAndUpdate({ _id: id }, actualExercise);
      return res.status(200).json({ message: 'Exercise updated successfully' });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },

  getAllExercises: async (req, res) => {
    try {
      const { page = 1, limit = 15 } = req.query;

      const exercises = await Exercise.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await Exercise.countDocuments();

      return res.status(200).json({
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        exercises,
      });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },

  deleteExercise: async (req, res) => {
    try {
      await Exercise.findOneAndDelete({ id: req.query._id });

      return res.status(200).json({ message: 'El ejercicio se ha eliminado correctamente' });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },
};

module.exports = ExerciseController;
