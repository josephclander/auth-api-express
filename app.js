const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
const PORT = 3000;
const mongoose = require("mongoose");

// clean the req.body received
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.set("strictQuery", false);

// this sets the local mongo db name to 'auth_userDB'
const mongoDbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/auth_userDB";

mongoose
  .connect(mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB Connected at ${mongoDbURL}`));

const userSchema = {
  email: String,
  password: String,
};

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  const { data } = req.body;
  res.send(data);
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      console.log();
    } else {
      res.send("success");
    }
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
