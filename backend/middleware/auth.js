const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'st-luke-hr-secret-key-2024';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = { authMiddleware, generateToken, JWT_SECRET };
