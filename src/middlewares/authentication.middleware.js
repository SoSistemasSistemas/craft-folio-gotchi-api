const jwt = require('jsonwebtoken');

const { UNAUTHORIZED } = require('http-status-codes');
const { USER_NOT_AUTHENTICATED, INVALID_TOKEN } = require('../constants/message.constant');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(UNAUTHORIZED).json({ error: USER_NOT_AUTHENTICATED });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(UNAUTHORIZED).json({ error: INVALID_TOKEN });
    req.user = decoded;
    next();
  });
};
