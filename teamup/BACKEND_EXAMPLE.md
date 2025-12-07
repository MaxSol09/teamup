# 🔧 Backend Implementation Guide

## Пример реализации endpoint для заполнения профиля

---

## 📍 Endpoint спецификация

```
PATCH /users/profile
```

### Headers
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Request Body
```json
{
  "specialization": "Frontend Developer",
  "about": "Опытный разработчик с 5+ годами опыта...",
  "skills": ["React", "TypeScript", "Next.js"],
  "interests": ["Web Development", "UI/UX", "Open Source"],
  "status": "Открыт к предложениям"
}
```

### Response (200 OK)
```json
{
  "user": {
    "_id": "69348dd68bb92d01fc230f05",
    "vkId": "732241734",
    "name": "Иван Иванов",
    "avatar": "https://...",
    "specialization": "Frontend Developer",
    "about": "Опытный разработчик с 5+ годами опыта...",
    "skills": ["React", "TypeScript", "Next.js"],
    "interests": ["Web Development", "UI/UX", "Open Source"],
    "status": "Открыт к предложениям",
    "isProfileCompleted": true,
    "createdAt": "2025-12-06T20:11:02.772Z",
    "updatedAt": "2025-12-06T20:25:15.456Z"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "message": "Validation failed",
  "errors": {
    "specialization": "Минимум 3 символа",
    "skills": "Добавьте хотя бы один навык"
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "message": "Unauthorized"
}
```

---

## 🟢 Node.js + Express + MongoDB (Mongoose)

### Model (User.ts)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export type UserStatus = 
  | 'Ищу проект' 
  | 'Ищу команду' 
  | 'Ищу исполнителей' 
  | 'Открыт к предложениям' 
  | 'Не ищу сотрудничество';

export interface IUser extends Document {
  vkId: string;
  name?: string;
  avatar?: string;
  specialization?: string;
  about?: string;
  skills: string[];
  interests: string[];
  status: UserStatus;
  isProfileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    vkId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    name: { 
      type: String 
    },
    avatar: { 
      type: String 
    },
    specialization: { 
      type: String 
    },
    about: { 
      type: String 
    },
    skills: { 
      type: [String], 
      default: [] 
    },
    interests: { 
      type: [String], 
      default: [] 
    },
    status: { 
      type: String, 
      default: 'Открыт к предложениям',
      enum: [
        'Ищу проект',
        'Ищу команду',
        'Ищу исполнителей',
        'Открыт к предложениям',
        'Не ищу сотрудничество'
      ]
    },
    isProfileCompleted: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
```

### Middleware (auth.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JWTPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = decoded.userId;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Validation (validateProfile.ts)

```typescript
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateProfileCompletion = [
  body('specialization')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Специализация должна содержать минимум 3 символа'),
  
  body('about')
    .isString()
    .trim()
    .isLength({ min: 10 })
    .withMessage('О себе должно содержать минимум 10 символов'),
  
  body('skills')
    .isArray({ min: 1 })
    .withMessage('Добавьте хотя бы один навык'),
  
  body('skills.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Навык не может быть пустым'),
  
  body('interests')
    .isArray({ min: 1 })
    .withMessage('Добавьте хотя бы один интерес'),
  
  body('interests.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Интерес не может быть пустым'),
  
  body('status')
    .optional()
    .isString()
    .isIn([
      'Ищу проект',
      'Ищу команду',
      'Ищу исполнителей',
      'Открыт к предложениям',
      'Не ищу сотрудничество'
    ])
    .withMessage('Некорректный статус'),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.mapped()
    });
  }
  
  next();
};
```

### Controller (userController.ts)

```typescript
import { Response } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const completeProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { specialization, about, skills, interests, status } = req.body;
    const userId = req.userId;

    // Находим пользователя
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Обновляем профиль
    user.specialization = specialization;
    user.about = about;
    user.skills = skills;
    user.interests = interests;
    
    if (status) {
      user.status = status;
    }

    // Устанавливаем флаг завершения профиля
    user.isProfileCompleted = true;

    // Сохраняем
    await user.save();

    // Возвращаем обновленного пользователя
    return res.status(200).json({
      user: {
        _id: user._id,
        vkId: user.vkId,
        name: user.name,
        avatar: user.avatar,
        specialization: user.specialization,
        about: user.about,
        skills: user.skills,
        interests: user.interests,
        status: user.status,
        isProfileCompleted: user.isProfileCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};
```

### Routes (userRoutes.ts)

```typescript
import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { 
  validateProfileCompletion, 
  handleValidationErrors 
} from '../validation/validateProfile';
import { completeProfile } from '../controllers/userController';

const router = express.Router();

router.patch(
  '/profile',
  authMiddleware,                  // Проверка авторизации
  validateProfileCompletion,       // Валидация данных
  handleValidationErrors,          // Обработка ошибок валидации
  completeProfile                  // Контроллер
);

export default router;
```

### App Setup (app.ts)

```typescript
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Ваш frontend
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
```

---

## 🐍 Python + FastAPI + MongoDB (Motor)

### Model (models.py)

```python
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from datetime import datetime
from bson import ObjectId

UserStatus = Literal[
    "Ищу проект",
    "Ищу команду", 
    "Ищу исполнителей",
    "Открыт к предложениям",
    "Не ищу сотрудничество"
]

class CompleteProfileRequest(BaseModel):
    specialization: str = Field(..., min_length=3)
    about: str = Field(..., min_length=10)
    skills: List[str] = Field(..., min_items=1)
    interests: List[str] = Field(..., min_items=1)
    status: Optional[UserStatus] = "Открыт к предложениям"
    
    @validator('skills', 'interests')
    def validate_strings(cls, v):
        if not all(isinstance(item, str) and item.strip() for item in v):
            raise ValueError('Все элементы должны быть непустыми строками')
        return [item.strip() for item in v]

class User(BaseModel):
    id: str = Field(alias="_id")
    vk_id: str
    name: Optional[str] = None
    avatar: Optional[str] = None
    specialization: Optional[str] = None
    about: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    status: UserStatus = "Открыт к предложениям"
    is_profile_completed: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
```

### Middleware (auth.py)

```python
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from motor.motor_asyncio import AsyncIOMotorDatabase

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET, 
            algorithms=["HS256"]
        )
        user_id = payload.get("userId")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Routes (user_routes.py)

```python
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from .models import CompleteProfileRequest, User
from .auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.patch("/profile")
async def complete_profile(
    profile_data: CompleteProfileRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Заполнение профиля пользователя
    """
    try:
        # Обновляем профиль
        update_data = {
            "specialization": profile_data.specialization,
            "about": profile_data.about,
            "skills": profile_data.skills,
            "interests": profile_data.interests,
            "status": profile_data.status,
            "is_profile_completed": True,
            "updated_at": datetime.utcnow()
        }
        
        # Сохраняем в базу
        result = await db.users.find_one_and_update(
            {"_id": current_user["_id"]},
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Форматируем ответ
        user_response = {
            "_id": str(result["_id"]),
            "vkId": result["vk_id"],
            "name": result.get("name"),
            "avatar": result.get("avatar"),
            "specialization": result["specialization"],
            "about": result["about"],
            "skills": result["skills"],
            "interests": result["interests"],
            "status": result["status"],
            "isProfileCompleted": result["is_profile_completed"],
            "createdAt": result["created_at"].isoformat(),
            "updatedAt": result["updated_at"].isoformat()
        }
        
        return {"user": user_response}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error completing profile: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

---

## 🧪 Тестирование endpoint

### cURL

```bash
curl -X PATCH http://localhost:4529/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialization": "Frontend Developer",
    "about": "Опытный разработчик React приложений",
    "skills": ["React", "TypeScript", "Next.js"],
    "interests": ["Web Development", "UI/UX"],
    "status": "Открыт к предложениям"
  }'
```

### Postman

```
Method: PATCH
URL: http://localhost:4529/users/profile

Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Body (raw JSON):
{
  "specialization": "Frontend Developer",
  "about": "Опытный разработчик React приложений",
  "skills": ["React", "TypeScript", "Next.js"],
  "interests": ["Web Development", "UI/UX"],
  "status": "Открыт к предложениям"
}
```

---

## ✅ Чеклист реализации

- [ ] Создана Mongoose/Motor модель User
- [ ] Добавлено поле `isProfileCompleted: boolean`
- [ ] Создан middleware для авторизации
- [ ] Создана валидация данных
- [ ] Создан контроллер `completeProfile`
- [ ] Создан route `PATCH /users/profile`
- [ ] Добавлена обработка ошибок
- [ ] Настроен CORS для frontend
- [ ] Протестирован endpoint
- [ ] Добавлены логи для отладки

---

## 🔒 Безопасность

### Обязательные проверки

1. **Авторизация**: Только авторизованный пользователь может обновить свой профиль
2. **Валидация**: Проверка всех входных данных
3. **Sanitization**: Очистка от опасных символов
4. **Rate Limiting**: Ограничение количества запросов
5. **CORS**: Настройка разрешенных источников

### Пример Rate Limiting (Express)

```typescript
import rateLimit from 'express-rate-limit';

const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // Максимум 10 обновлений за 15 минут
  message: 'Too many requests, please try again later'
});

router.patch('/profile', 
  profileUpdateLimiter, 
  authMiddleware, 
  // ... остальные middleware
);
```

---

## 📊 Мониторинг

### Логирование

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export const completeProfile = async (req, res) => {
  try {
    logger.info('Profile completion started', { 
      userId: req.userId 
    });
    
    // ... логика
    
    logger.info('Profile completed successfully', { 
      userId: req.userId 
    });
    
  } catch (error) {
    logger.error('Profile completion failed', { 
      userId: req.userId, 
      error: error.message 
    });
  }
};
```

---

## 🎯 Результат

После реализации этого endpoint фронтенд модалка будет:

✅ Отправлять данные на `PATCH /users/profile`  
✅ Получать обновленного пользователя с `isProfileCompleted: true`  
✅ Обновлять Zustand store  
✅ Закрывать модалку  
✅ Больше не показывать модалку этому пользователю  

**Всё готово к интеграции!** 🎉


