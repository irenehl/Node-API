/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const HttpError = require('../../misc/HttpError');
const { registerValidator, loginValidator, updateValidator } = require('./validator');
const Exercise = require('../../models/exercise.model');

const ExerciseController = {
  register: async (req, res) => {
    try {
      const newExercise = new Exercise({
        exercise: req.body.exercise,
        value: req.body.description,
        date: Date.now(),
      });

      await newExercise.save();

      return res.status(201).json({ error: false, message: 'user registered successfully' });
    } catch (err) {
      return res.status(err.status).json({ error: true, message: err.details != null ? err.details[0].message : err });
    }
  },

  loginUser: async (req, res) => {
    try {
      await loginValidator(req.body);

      const user = await User.findOne({ username: req.body.username });
      const logged = await bcrypt.compare(req.body.password, user.password);

      if (!user || !logged) throw new HttpError('Nombre de usuario o contraseña incorrectos', 403);

      if (!logged) throw new HttpError('Contraseña invalida', 402);

      const token = jwt.sign({ _username: user.username }, process.env.TOKEN_KEY);

      return res.status(200).json({ error: false, message: 'Ok', token });
    } catch (err) {
      return res.status(err.status).json({ error: true, message: err.details != null ? err.details[0].message : err });
    }
  },

  updateUser: async (req, res) => {
    try {
      await updateValidator(req.body);

      let actualUser = await User.findOne({ _id: req.user._id });

      const matchUsers = await User.find({ username: req.body.username });

      let unique;

      if (matchUsers.length !== 0) {
        matchUsers.forEach((u) => {
          if (u.username === req.body.username) unique = false;
        });
      }

      if (!unique) throw new HttpError('Nombre de usuario inválido', 401);

      const hashedPassword = req.body.password == null ? null
        : await bcrypt.hash(req.body.password, parseInt(process.env.SALT, 10));

      actualUser = {
        username: req.body.username || actualUser.username,
        password: hashedPassword || actualUser.password,
      };

      await User.findOneAndUpdate({ _username: req.user._username }, actualUser);
      return res.status(200).json({ error: false, message: 'user updated successfull' });
    } catch (err) {
      return res.status(err.status).json({ error: true, message: err.details != null ? err.details[0].message : err });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 15 } = req.query;

      const users = await User.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await User.countDocuments();

      return res.status(200).json({
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        users,
      });
    } catch (err) {
      return res.status(405).json({ error: true, message: 'Datos no disponibles' });
    }
  },

  getCurrentUser: async (req, res) => {
    const user = await User.findOne({ _username: req.user._username });

    return res.status(200).json(user);
  },

  deleteUser: async (req, res) => {
    try {
      await User.findOneAndDelete({ _username: req.user._username });

      return res.status(200).json({ error: false, message: `El usuario ${req.user._username} se ha eliminado correctamente` });
    } catch (err) {
      return res.status(405).json({ error: true, message: `El usuario ${req.user._username} no fue eliminado` });
    }
  },

};

module.exports = ExerciseController;
