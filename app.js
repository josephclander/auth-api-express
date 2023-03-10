const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRouter = require('./user/routes');

app.use(cors({ credentials: true, origin: 'https://auth-client-react.vercel.app/' }));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use('/auth', userRouter);
const tokenAuth = require('./middleware/tokenAuth');

app.post('/welcome', tokenAuth, (req, res) => {
  res.status(200).send('This is a protected page');
});

module.exports = app;
