
// models/Channel.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IChannel extends Document {
  channelId: string;

  name: string;

  category?: string;

  logo?: string;

  streamUrl: string;

  country?: string;

  language?: string;

  isGlobal: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const channelSchema = new Schema<IChannel>(
  {
    channelId: {
      type: String,
      required: [true, 'Channel ID là bắt buộc'],
      unique: true,
      trim: true,
      uppercase: true
    },

    name: {
      type: String,
      required: [true, 'Tên channel là bắt buộc'],
      trim: true
    },

    category: {
      type: String,
      default: 'Unknown',
      trim: true
    },

    logo: {
      type: String,
      default: ''
    },

    streamUrl: {
      type: String,
      required: [true, 'Stream URL là bắt buộc']
    },

    country: {
      type: String,
      default: ''
    },

    language: {
      type: String,
      default: ''
    },

    isGlobal: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

channelSchema.index({ category: 1 });
channelSchema.index({ name: 1 });

if (mongoose.models.Channel) {
  delete mongoose.models.Channel;
}

export const Channel = mongoose.model<IChannel>(
  'Channel',
  channelSchema
);
