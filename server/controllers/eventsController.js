import { Event } from '../models/EventModel.js';
import { User } from '../models/UserModel.js';

// Создать мероприятие (только admin)
export const createEvent = async (req, res) => {
  try {
    const { title, description, theme, tags, date } = req.body;

    if (!title || !description || !theme || !date) {
      return res.status(400).json({ message: 'Не все обязательные поля заполнены' });
    }

    const event = await Event.create({
      title,
      description,
      theme,
      tags: tags || [],
      date,
      createdBy: req.userId,
      participants: [],
    });

    const populatedEvent = await event.populate('createdBy', 'name avatar');

    res.status(201).json(populatedEvent);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при создании мероприятия',
      error: e.message,
    });
  }
};

// Получить все мероприятия с подсчетом единомышленников
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name avatar')
      .populate('participants', 'name avatar skills interests status')
      .sort({ date: 1, createdAt: -1 });

    // Получаем текущего пользователя для подсчета единомышленников
    const currentUserId = req.userId;
    let currentUser = null;
    if (currentUserId) {
      currentUser = await User.findById(currentUserId).select('skills interests status');
    }

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const participantsCount = event.participants.length;

        // Подсчет единомышленников (среди участников мероприятия)
        let likeMindedCount = 0;
        if (currentUser && event.participants.length > 0) {
          likeMindedCount = event.participants.filter((participant) => {
            // Пропускаем текущего пользователя
            if (participant._id.toString() === currentUserId.toString()) {
              return false;
            }

            // Проверяем пересечение skills
            const hasCommonSkills = participant.skills && participant.skills.length > 0 &&
              currentUser.skills && currentUser.skills.length > 0 &&
              participant.skills.some((skill) => currentUser.skills.includes(skill));

            // Проверяем пересечение interests
            const hasCommonInterests = participant.interests && participant.interests.length > 0 &&
              currentUser.interests && currentUser.interests.length > 0 &&
              participant.interests.some((interest) => currentUser.interests.includes(interest));

            // Проверяем статус
            const hasOpenStatus = participant.status === 'Открыт к предложениям' ||
              participant.status === 'Ищу команду';

            return (hasCommonSkills || hasCommonInterests) && hasOpenStatus;
          }).length;
        }

        // Проверяем, записан ли текущий пользователь
        const isParticipant = currentUserId && event.participants.some(
          (p) => p._id.toString() === currentUserId.toString()
        );

        return {
          _id: event._id,
          title: event.title,
          description: event.description,
          theme: event.theme,
          tags: event.tags,
          date: event.date,
          createdBy: event.createdBy,
          participantsCount,
          likeMindedCount,
          isParticipant,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении мероприятий',
      error: e.message,
    });
  }
};

// Записаться на мероприятие
export const joinEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    // Проверка на повторную запись
    if (event.participants.includes(userId)) {
      return res.status(400).json({ message: 'Вы уже записаны на это мероприятие' });
    }

    event.participants.push(userId);
    await event.save();

    const populatedEvent = await event.populate('createdBy', 'name avatar');
    const participantsCount = event.participants.length;

    res.json({
      ...populatedEvent.toObject(),
      participantsCount,
      isParticipant: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при записи на мероприятие',
      error: e.message,
    });
  }
};

// Отписаться от мероприятия
export const leaveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    // Проверка, записан ли пользователь
    if (!event.participants.includes(userId)) {
      return res.status(400).json({ message: 'Вы не записаны на это мероприятие' });
    }

    event.participants = event.participants.filter(
      (p) => p.toString() !== userId.toString()
    );
    await event.save();

    const populatedEvent = await event.populate('createdBy', 'name avatar');
    const participantsCount = event.participants.length;

    res.json({
      ...populatedEvent.toObject(),
      participantsCount,
      isParticipant: false,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при отписке от мероприятия',
      error: e.message,
    });
  }
};

// Получить мои мероприятия (по участию)
export const getMyEvents = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const events = await Event.find({ participants: userId })
      .populate('createdBy', 'name avatar')
      .populate('participants', 'name avatar skills interests status')
      .sort({ date: 1, createdAt: -1 });

    const currentUser = await User.findById(userId).select('skills interests status');

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const participantsCount = event.participants.length;

        // Подсчет единомышленников (среди участников мероприятия)
        let likeMindedCount = 0;
        if (currentUser && event.participants.length > 0) {
          likeMindedCount = event.participants.filter((participant) => {
            // Пропускаем текущего пользователя
            if (participant._id.toString() === userId.toString()) {
              return false;
            }

            const hasCommonSkills = participant.skills && participant.skills.length > 0 &&
              currentUser.skills && currentUser.skills.length > 0 &&
              participant.skills.some((skill) => currentUser.skills.includes(skill));

            const hasCommonInterests = participant.interests && participant.interests.length > 0 &&
              currentUser.interests && currentUser.interests.length > 0 &&
              participant.interests.some((interest) => currentUser.interests.includes(interest));

            const hasOpenStatus = participant.status === 'Открыт к предложениям' ||
              participant.status === 'Ищу команду';

            return (hasCommonSkills || hasCommonInterests) && hasOpenStatus;
          }).length;
        }

        return {
          _id: event._id,
          title: event.title,
          description: event.description,
          theme: event.theme,
          tags: event.tags,
          date: event.date,
          createdBy: event.createdBy,
          participantsCount,
          likeMindedCount,
          isParticipant: true,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении моих мероприятий',
      error: e.message,
    });
  }
};

// Обновить мероприятие (только admin)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, theme, tags, date } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (theme) event.theme = theme;
    if (tags) event.tags = tags;
    if (date) event.date = date;

    await event.save();

    const populatedEvent = await event.populate('createdBy', 'name avatar');
    const participantsCount = event.participants.length;

    res.json({
      ...populatedEvent.toObject(),
      participantsCount,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при обновлении мероприятия',
      error: e.message,
    });
  }
};

// Удалить мероприятие (только admin)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: 'Мероприятие успешно удалено' });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при удалении мероприятия',
      error: e.message,
    });
  }
};

// Получить участников мероприятия
export const getEventParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate('participants', 'name avatar skills interests status');

    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    res.json(event.participants);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Ошибка при получении участников',
      error: e.message,
    });
  }
};

