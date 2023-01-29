const User = require('./schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserController = {
  Register: async (req, res) => {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const newUser = new User({
        email: email.toLowerCase(),
        password: encryptedPassword,
      });
      await newUser.save();
      const token = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '2h',
        }
      );
      const options = {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
      };
      res.status(200).cookie('jwt', token, options).send('sent with cookie');
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
      const foundUser = await User.findOne({ email: email.toLowerCase() });
      const isCorrectPassword = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!foundUser || !isCorrectPassword) {
        res.status(400).send('incorrect login details');
      } else {
        const token = jwt.sign(
          { email: foundUser.email },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: '2h',
          }
        );
        const options = {
          maxAge: 60 * 60 * 24,
          httpOnly: true,
        };
        res.status(200).cookie('jwt', token, options).send('sent with cookie');
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = UserController;
