
import { Schema, model, Types } from 'mongoose';

const ProjectSchema = new Schema(
  {
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
      'Айти',
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
    type: Types.ObjectId,
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
}
);

export const Project = model('Project', ProjectSchema);
