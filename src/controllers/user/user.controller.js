/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const HttpError = require('../../misc/HttpError');
const { registerValidator, loginValidator, updateValidator } = require('./validator');

const UserController = {
  register: async (req, res) => {
    try {
      await registerValidator(req.body);

      const notUnique = await User.find({ username: req.body.username });

      if (!notUnique) throw new HttpError('Nombre de usuario invalido', 400);

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        goal: req.body.goal,
        weight: req.body.weight,
        height: req.body.height,
        weight_setting: req.body.weight_setting,
        height_setting: req.body.height_setting,
        exercise_setting: req.body.exercise_setting,
      });

      await newUser.save();

      return res.status(201).json({ message: 'user registered successfully' });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      await loginValidator(req.body);

      const user = await User.findOne({ username: req.body.username });

      if (!user) { throw new HttpError('Usuario no encontrado', 404); }

      const logged = await bcrypt.compare(req.body.password, user.password);

      if (!user || !logged) throw new HttpError('Nombre de usuario o contraseña incorrectos', 403);

      if (!logged) throw new HttpError('Contraseña invalida', 402);

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY);

      return res.status(200).json({ message: 'Ok', token });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      await updateValidator(req.body);

      const {
        username, password, goal, weight, height, weight_setting, height_setting, exercise_setting,
      } = req.body;

      let actualUser = await User.findOne({ _id: req.user._id });

      if (username) {
        const isUnique = await User.count({ username }) === 0;

        if (!isUnique) throw new HttpError('Usuario se encuentra en uso', 400);
      }

      const hashedPassword = password == null ? null
        : await bcrypt.hash(password, parseInt(process.env.SALT, 10));

      actualUser = {
        username: username || actualUser.username,
        password: hashedPassword || actualUser.password,
        goal: goal || actualUser.goal,
        weight: weight || actualUser.weight,
        height: height || actualUser.height,
        weight_setting: weight_setting || actualUser.weight_setting,
        height_setting: height_setting || actualUser.height_setting,
        exercise_setting: exercise_setting || actualUser.exercise_setting,
      };

      await User.findOneAndUpdate({ _id: req.user._id }, actualUser);
      return res.status(200).json({ error: false, message: 'user updated successfully' });
    } catch (err) {
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
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
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
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
      const code = err.statusCode == null ? 400 : err.statusCode();

      return res.status(code)
        .json({ message: err.details != null ? err.details[0].message : err.message });
    }
  },

};

module.exports = UserController;
