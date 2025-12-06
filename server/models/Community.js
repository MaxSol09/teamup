const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  theme: {
    type: String,
    enum: [
      'IT',
      'Наука',
      'Учёба',
      'Бизнес',
      'Творчество',
      'Сфера не указана'
    ],
    default: 'Сфера не указана'
  },

  tags: [{
    type: String,
    trim: true
  }],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  isPublic: {
    type: Boolean,
    default: true   // ✅ ВАЖНО: теперь ТОЛЬКО тут
  },

  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  chatId: {
    type: String,   // чат ВСЕЙ группы
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Community', CommunitySchema);
