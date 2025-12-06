import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Нет токена' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    req.userId = decoded.userId;

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
};
