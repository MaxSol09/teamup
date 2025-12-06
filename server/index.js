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

// Configure MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
  connectTimeoutMS: 30000, // 30 seconds timeout for initial connection
  maxPoolSize: 10, // Maintain up to 10 socket connections
  retryWrites: true,
  w: 'majority', // Write concern
};

// Connect to MongoDB and start server only after successful connection
const connectDB = async () => {
  try {
    if (!process.env.DATA_BASE) {
      throw new Error('DATA_BASE environment variable is not set');
    }

    await mongoose.connect(process.env.DATA_BASE, mongooseOptions);
    
    console.log('✅ MongoDB connected successfully');
    
    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Start the server only after successful database connection
    startServer();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    
    // Check if it's an IP whitelist issue
    const errorMessage = error.message || '';
    const errorName = error.name || '';
    
    if (
      errorName === 'MongooseServerSelectionError' ||
      errorMessage.includes('whitelist') ||
      errorMessage.includes('IP') ||
      errorMessage.includes('network') ||
      errorMessage.includes('ReplicaSetNoPrimary')
    ) {
      console.error('\n🔒 IP WHITELIST ISSUE DETECTED:');
      console.error('Your current IP address is not whitelisted in MongoDB Atlas.');
      console.error('To fix this:');
      console.error('1. Go to https://cloud.mongodb.com/');
      console.error('2. Navigate to Network Access (Security → Network Access)');
      console.error('3. Click "Add IP Address"');
      console.error('4. Either add your current IP or use "0.0.0.0/0" (ALLOW ALL - less secure but works everywhere)');
      console.error('5. Wait a few minutes for changes to propagate\n');
    }
    
    console.error('Server will not start until database connection is established.');
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(4529, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err);
      return;
    }
    console.log('🚀 Server started on port 4529');
  });
};

// Initialize database connection
connectDB();

const corsConfig = {
  origin: [
    'http://localhost:3000',
    'https://teamup-579l.vercel.app',
    'https://malorie-preponderant-superprecisely.ngrok-free.dev'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsConfig)); 


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