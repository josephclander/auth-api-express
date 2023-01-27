const User = require('./schema');

const UserController = {
  Register: async (req, res) => {
    try {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      res.status(200).send('success');
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        Object.keys(error.errors).forEach((key) => {
          validationErrors[key] = error.errors[key].message;
        });
        res.status(400).send(validationErrors);
      } else if (error.code === 11000) {
        res.status(409).send('duplicate email');
      } else {
        res.status(500).send(error);
      }
    }
  },
  Login: async (req, res) => {
    const { email, password } = req.body;
    // does a user exist with that email?
    User.findOne({ email }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.status(200).send('successful login');
          } else {
            res.status(400).send('incorrect password for email');
          }
        } else {
          res.status(400).send('no account with that email');
        }
      }
    });
  },
};

module.exports = UserController;
