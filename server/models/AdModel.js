import { Schema, model, Types } from 'mongoose';

const AdSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    theme: {
      type: String,
      required: true, // "Айти", "Учёба", "Наука"
    },

    tags: {
      type: [String],
      default: [],
    },

    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export const Ad = model('Ad', AdSchema);
