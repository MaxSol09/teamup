const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
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

  tags: [
    {
      type: String,
      trim: true
    }
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
