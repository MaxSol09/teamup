import { User } from "../models/UserModel.js";
import jwt from 'jsonwebtoken';

export const completeRegistration = async (req, res) => {
  try {
    const userId = req.userId; // authMiddleware должен установить это
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      name,
      specialization,
      about,
      skills = [],
      interests = [],
      status,
      isOpenForInvites = false,
      socials = {}, // { github, telegram }
    } = req.body;

    // Валидация: status должен быть одним из enum
    const allowedStatuses = [
      'Ищу проект',
      'Ищу команду',
      'Ищу исполнителей',
      'Открыт к предложениям',
      'Не ищу сотрудничество',
    ];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Некорректный статус пользователя' });
    }

    // skills / interests должны быть массивами
    if (!Array.isArray(skills) || !Array.isArray(interests)) {
      return res.status(400).json({ message: 'skills и interests должны быть массивами' });
    }

    // Обновляем документ: не делаем обязательным specialization или about
    const update = {
      ...(name !== undefined ? { name } : {}),
      ...(specialization !== undefined ? { specialization } : {}),
      ...(about !== undefined ? { about } : {}),
      skills,
      interests,
      ...(status !== undefined ? { status } : {}),
      isOpenForInvites: Boolean(isOpenForInvites),
      socials: {
        github: socials.github || undefined,
        telegram: socials.telegram || undefined,
      },
      isProfileCompleted: true,
      updatedAt: new Date(),
      // если роль ещё не задана — оставляем
    };

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-__v');

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    return res.json({ user });
  } catch (err) {
    console.error('complete-registration error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select('-__v');

  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  res.json(user);
}

export const registerVk =  async (req, res) => {
  const { vkId } = req.body;

  if (!vkId) {
    return res.status(400).json({ message: 'vkId обязателен' });
  }

  const existingUser = await User.findOne({ vkId });

  if (existingUser) {
    return res.status(400).json({
      message: 'Пользователь уже зарегистрирован',
    });
  }

  const user = await User.create({
    vkId,
    skills: [],
    interests: [],
    status: 'Открыт к предложениям',
    isProfileCompleted: false,
  });

  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_TOKEN,
    { expiresIn: '30d' }
  );

  res.json({
    token,
    user,
  });
}



export const loginVk = async (req, res) => {
  const { vkId } = req.body;

  if (!vkId) {
    return res.status(400).json({ message: 'vkId обязателен' });
  }

  const user = await User.findOne({ vkId });

  // ❗ ЕСЛИ НЕ НАЙДЕН → НА РЕГИСТРАЦИЮ
  if (!user) {
    return res.status(404).json({
      isRegistered: false,
    });
  }

  // ✅ ЕСЛИ НАЙДЕН → ВЫДАЁМ ТОКЕН
  const token = jwt.sign(
    { userId: user._id },
    process.env.SECRET_TOKEN,
    { expiresIn: '30d' }
  );

  res.json({
    isRegistered: true,
    token,
    user,
  });
}