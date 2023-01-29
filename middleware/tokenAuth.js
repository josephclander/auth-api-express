const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // remove 'bearer' section to get token
  const token = req.headers.authorization.slice(7);
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

module.exports = verifyToken;
