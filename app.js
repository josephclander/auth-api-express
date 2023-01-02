const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const userRouter = require('./user/routes');

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use('/auth', userRouter);

module.exports = app;
