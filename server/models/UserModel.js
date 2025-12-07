import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    vkId: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,
    avatar: String,

    specialization: {
      type: String,
      default: '',
    },

    about: {
      type: String,
      default: '',
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String], // ✅ ДЛЯ ФИЛЬТРОВ И РЕКОММЕНДАЦИЙ
      default: [],
    },

    status: {
      type: String,
      enum: [
        'Ищу проект',
        'Ищу команду',
        'Ищу исполнителей',
        'Открыт к предложениям',
        'Не ищу сотрудничество',
      ],
      default: 'Открыт к предложениям',
    },

    isOpenForInvites: {
      type: Boolean,
      default: false
    },

    socials: {
      github: String,
      telegram: String,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);