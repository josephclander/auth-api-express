const mongoose = require('mongoose');

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = {
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: 'Email address is not unique',
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: 'Please provide a password',
  },
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
