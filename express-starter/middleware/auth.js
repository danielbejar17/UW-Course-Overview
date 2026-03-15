import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    req.user = payload; // { id, username }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}