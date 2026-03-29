import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }

    req.user = verified.id;
    req.userRole = verified.role;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Higher-order middleware for role-based access
export const roleMiddleware = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};
