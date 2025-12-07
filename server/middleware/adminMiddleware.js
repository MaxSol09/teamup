import { User } from '../models/UserModel.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен. Требуется роль администратора' });
    }

    next();
  } catch (e) {
    console.error('Ошибка в adminMiddleware:', e);
    return res.status(500).json({ message: 'Ошибка проверки прав доступа' });
  }
};


