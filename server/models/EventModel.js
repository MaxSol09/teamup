import { Schema, model, Types } from 'mongoose';

const EventSchema = new Schema(
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
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    date: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    participants: {
      type: [Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export const Event = model('Event', EventSchema);


