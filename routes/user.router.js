const express = require('express');

const router = express.Router();

const Authenticator = require('./authenticator');
const {
  register, loginUser, getCurrentUser, getAllUsers,
  updateUser, deleteUser,
} = require('../src/controllers/user/user.controller');

router.get('/', getAllUsers);
router.get('/:username', getCurrentUser);

router.post('/login', loginUser);
router.post('/register', register);

router.put('/update', Authenticator, updateUser);

router.delete('/delete', Authenticator, deleteUser);

module.exports = router;
