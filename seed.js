const mongoose = require('mongoose');
const User = require('./user/schema');

mongoose.set('strictQuery', false);
const mongoDbURL = 'mongodb://localhost:27017/auth_userDB_test';
mongoose
  .connect(mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB Connected at ${mongoDbURL}`));

const seedUsers = [
  {
    email: 'philiy@example.com',
    password: '1234',
  },
  {
    email: 'joe@example.com',
    password: '123456',
  },
];

const seedDB = async () => {
  await User.deleteMany({});
  await User.insertMany(seedUsers);
};

seedDB().then(() => {
  mongoose.connection.close();
});
