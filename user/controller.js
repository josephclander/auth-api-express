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
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      };
      res
        .status(200)
        .cookie('jwt_lander_auth', token, options)
        .json({ message: 'Signed Up & Logged In -> jwt sent with cookie' });
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
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
        };
        res
          .status(200)
          .cookie('jwt_lander_auth', token, options)
          .json({ message: 'Logged In -> jwt sent with cookie' });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  Logout: async (req, res) => {
    try {
      const options = {
        maxAge: -1,
        httpOnly: true,
      };
      res
        .status(200)
        .cookie('jwt_lander_auth', null, options)
        .json({ message: 'Logged Out' });
    } catch (err) {
      console.log(err);
    }
  },
  Status: async (req, res) => {
    try {
      const cookiePresent = req.cookies['jwt_lander_auth'];
      if (!cookiePresent || cookiePresent === null) {
        res
          .status(400)
          .json({ message: 'Need to sign in', isAuthenticated: false });
      } else {
        const verifiedCookie = jwt.verify(
          cookiePresent,
          process.env.JWT_SECRET_KEY
        );
        if (verifiedCookie) {
          res.status(200).json({ message: 'Success', isAuthenticated: true });
        } else {
          res.status(403).json({ message: 'Denied', isAuthenticated: false });
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = UserController;
