import { model, Schema, Types } from "mongoose";


const communitySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    theme: { type: String, required: true },
    tags: { type: [String], default: [] },

    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },

    isPublic: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Community = model('Community', communitySchema);