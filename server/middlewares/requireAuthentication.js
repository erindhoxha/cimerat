const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, 'MY_SECRET_KEY');
    const { userId } = payload;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
};
