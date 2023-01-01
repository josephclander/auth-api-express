const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const mongoose = require('mongoose');
const userRouter = require('./user/routes');

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.set('strictQuery', false);
const mongoDbURL =
  process.env.MONGODB_URL || 'mongodb://localhost:27017/auth_userDB';

mongoose
  .connect(mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB Connected at ${mongoDbURL}`));

app.use('/auth', userRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
