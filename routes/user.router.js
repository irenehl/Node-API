const express = require('express');

const router = express.Router();

const Authenticator = require('./authenticator');
const {
  register, loginUser, getCurrentUser, getAllUsers,
  updateUser, deleteUser,
} = require('../src/controllers/user/user.controller');

router.get('/', Authenticator, getAllUsers);
router.get('/:id', Authenticator, getCurrentUser);

router.post('/login', loginUser);
router.post('/register', register);

router.put('/update', Authenticator, updateUser);

router.delete('/delete/:id', Authenticator, deleteUser);

module.exports = router;
