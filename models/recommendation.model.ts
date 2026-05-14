import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  channelId: string;
  score: number;
  reason: string;
  algorithm: 'collaborative' | 'content-based' | 'trending' | 'hybrid';
  isViewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
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
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reason: {
      type: String,
      default: 'Dựa trên sở thích của bạn'
    },
    algorithm: {
      type: String,
      enum: ['collaborative', 'content-based', 'trending', 'hybrid'],
      default: 'hybrid'
    },
    isViewed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index để tìm recommendation nhanh
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ userId: 1, score: -1 });
recommendationSchema.index({ userId: 1, channelId: 1 }, { unique: true });
recommendationSchema.index({ createdAt: -1 });

if (mongoose.models.Recommendation) {
  delete mongoose.models.Recommendation;
}

export const Recommendation = mongoose.model<IRecommendation>(
  'Recommendation',
  recommendationSchema
);
