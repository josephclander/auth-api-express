const express = require('express');
const router = express.Router();

const UserController = require('./controller');

router.post('/register', UserController.Register);
router.post('/login', UserController.Login);

module.exports = router;
