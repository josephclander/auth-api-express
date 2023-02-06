const express = require('express');
const router = express.Router();

const { Register, Login, Status } = require('./controller');

router.post('/register', Register);
router.post('/login', Login);
router.post('/status', Status);

module.exports = router;
