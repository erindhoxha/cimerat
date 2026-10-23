const jwt = require('jsonwebtoken');

// Logins stay valid this long; after that the app asks the user to sign in again
const TOKEN_TTL = '90d';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set. Add it to the server environment (e.g. heroku config:set JWT_SECRET=...).');
  }
  // Local development only; never used when NODE_ENV=production
  return 'dev-only-insecure-secret';
};

// Fail at startup rather than on the first login
if (!process.env.JWT_SECRET) {
  getSecret();
  console.warn('JWT_SECRET is not set; using an insecure development secret.');
}

const signToken = (userId) => jwt.sign({ userId }, getSecret(), { expiresIn: TOKEN_TTL });

// Throws if the token is invalid, expired, or signed with a different secret
const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { signToken, verifyToken };
