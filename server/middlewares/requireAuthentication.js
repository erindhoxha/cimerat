const { verifyToken } = require('../utils/auth');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = verifyToken(token);
    const { userId } = payload;
    // Never expose the password hash through req.user (it's returned by GET /user)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
};
