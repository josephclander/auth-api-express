const User = require('./schema');
const jwt = require('jsonwebtoken');

const UserController = {
  Register: async (req, res) => {
    try {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      const token = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '2h',
        }
      );
      res.status(200).json({ email: newUser.email, token });
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
    try {
      const { email, password } = req.body;
      const foundUser = await User.findOne({ email });
      if (!foundUser || foundUser.password !== password) {
        res.status(400).send('incorrect login details');
      } else {
        const token = jwt.sign(
          { email: foundUser.email },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: '2h',
          }
        );
        res.status(200).json({ email: foundUser.email, token });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = UserController;
