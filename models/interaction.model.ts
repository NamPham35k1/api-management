// models/Interaction.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;

  channelId: string;

  clickCount: number;

  watchDuration: number;

  favorite: boolean;

  interactionScore: number;

  lastWatchedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    channelId: {
      type: String,
      required: [true, 'Channel ID là bắt buộc'],
      trim: true,
      uppercase: true
    },

    clickCount: {
      type: Number,
      default: 0,
      min: 0
    },

    watchDuration: {
      type: Number,
      default: 0,
      min: 0
    },

    favorite: {
      type: Boolean,
      default: false
    },

    interactionScore: {
      type: Number,
      default: 0
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// 1 user chỉ có 1 interaction record / channel
interactionSchema.index(
  {
    userId: 1,
    channelId: 1
  },
  {
    unique: true
  }
);

interactionSchema.index({ interactionScore: -1 });

if (mongoose.models.Interaction) {
  delete mongoose.models.Interaction;
}

export const Interaction = mongoose.model<IInteraction>(
  'Interaction',
  interactionSchema
);
