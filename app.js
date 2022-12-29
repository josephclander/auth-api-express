const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const mongoose = require('mongoose');

// clean the req.body received
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.set('strictQuery', false);

// this sets the local mongo db name to 'auth_userDB'
const mongoDB_URL = 'mongodb://localhost:27017/auth_userDB';

mongoose
  .connect(mongoDB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`MongoDB Connected at ${mongoDB_URL}`));

app.get('/', (req, res) => {
  const { data } = req.body;
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
