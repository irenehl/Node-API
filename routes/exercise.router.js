const express = require('express');

const router = express.Router();
const Authenticator = require('./authenticator');
const {
  register, updateExercise, getAllExercises, deleteExercise,
} = require('../src/controllers/exercise/exercise.controller');

router.post('/', Authenticator, register);

router.put('/:id', Authenticator, updateExercise);

router.get('/', Authenticator, getAllExercises);

router.delete('/:id', Authenticator, deleteExercise);

module.exports = router;
