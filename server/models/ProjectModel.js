const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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

  chatId: {
    type: String,  // чат ТОЛЬКО между owner и принятыми людьми
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
