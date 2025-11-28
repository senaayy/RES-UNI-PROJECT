const jwt = require('jsonwebtoken');

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || 'demo-user';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    req.user = DEFAULT_USER_ID;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;

