import { configDotenv } from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
import cors from 'cors'
import { User } from './models/UserModel.js';
import { authMiddleware } from './middleware/authMiddleware.js';

configDotenv()

const app = express()

app.use(express.json());

mongoose.connect(
    process.env.DATA_BASE,
).then(() => {
    console.log('MongoDB connect')
}).catch((err) => {
    console.log('error connection data base > ', err)
})


app.listen(4529, (err) => {
    if(err){
        return console.error(err)
    }

    console.log('сервер стартанул')
})

const corsConfig = {
    origin: ['http://localhost:3000', 'https://teamup-579l.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(cors(corsConfig))


app.post('/vk/login', async (req, res) => {
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
});


app.post('/vk/register', async (req, res) => {
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
});


app.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-__v');

  if (!user) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  res.json(user);
});