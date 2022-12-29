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

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = {
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: "Email address is not unique",
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: { type: String, required: "Please provide a password" },
};

const User = new mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    res.status(200).send("success");
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      res.status(400).send(validationErrors);
    }
    if (error.code === 11000) {
      res.status(409).send("duplicate email");
    }
    console.log(error);
    res.status(500).send(error);
  }
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
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
