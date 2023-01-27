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
    try {
      const { email, password } = req.body;
      const foundUser = await User.findOne({ email });
      if (!foundUser || foundUser.password !== password) {
        res.status(400).send('incorrect login details');
      } else {
        res.status(200).send('successful login');
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = UserController;
