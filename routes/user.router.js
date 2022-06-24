const express = require('express');

const router = express.Router();

const Authenticator = require('./authenticator');
const {
  register, loginUser, getUser, getAllUsers,
  updateUser, deleteUser,
} = require('../src/controllers/user/user.controller');

router.get('/', getAllUsers);
router.get('/info', Authenticator, getUser);

router.post('/login', loginUser);
router.post('/register', register);

router.put('/update', Authenticator, updateUser);

router.delete('/delete', Authenticator, deleteUser);

module.exports = router;
