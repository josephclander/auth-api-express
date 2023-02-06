const express = require('express');
const router = express.Router();

const { Register, Login, Logout, Status } = require('./controller');

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/status', Status);

module.exports = router;
