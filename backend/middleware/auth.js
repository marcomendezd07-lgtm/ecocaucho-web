import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No autenticado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesión inválida' });
  }
};
