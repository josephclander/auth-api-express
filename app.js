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
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
};

const User = new mongoose.model("User", userSchema);

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save((err) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.status(200).send("success");
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // does a user exist with that email?
  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.send("successful login");
        } else {
          res.status(400);
          res.send("incorrect password for email");
        }
      } else {
        res.status(400);
        res.send("no account with that email");
      }
    }
  });
  // if yes, is the password the same?
  // send a success login
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
