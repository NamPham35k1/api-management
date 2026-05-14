import { Interaction, IInteraction } from '../models/interaction.model';
import mongoose from 'mongoose';

export const createInteraction = async (interactionData: {
  userId: string;
  channelId: string;
  clickCount?: number;
  watchDuration?: number;
  favorite?: boolean;
  interactionScore?: number;
}): Promise<IInteraction> => {
  const interaction = new Interaction({
    ...interactionData,
    userId: typeof interactionData.userId === 'string' 
      ? new mongoose.Types.ObjectId(interactionData.userId)
      : interactionData.userId
  });
  return await interaction.save();
};

export const findInteraction = async (
  userId: string,
  channelId: string
): Promise<IInteraction | null> => {
  return await Interaction.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    channelId: channelId.toUpperCase()
  });
};

export const updateInteraction = async (
  userId: string,
  channelId: string,
  updates: Partial<IInteraction>
): Promise<IInteraction | null> => {
  return await Interaction.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      channelId: channelId.toUpperCase()
    },
    { $set: updates },
    { new: true, runValidators: true }
  );
};

export const upsertInteraction = async (
  userId: string,
  channelId: string,
  watchDuration: number = 0,
  favorite: boolean = false
): Promise<IInteraction | null> => {
  let score = 0;
  score += 1; // click
  if (watchDuration >= 300) {
    score += 3;
  }
  if (favorite) {
    score += 5;
  }

  return await Interaction.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(userId),
      channelId: channelId.toUpperCase()
    },
    {
      $inc: {
        clickCount: 1,
        watchDuration: watchDuration,
        interactionScore: score
      },
      $set: {
        favorite,
        lastWatchedAt: new Date()
      }
    },
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  );
};

export const getUserInteractions = async (
  userId: string,
  limit: number = 20,
  skip: number = 0
): Promise<IInteraction[]> => {
  return await Interaction.find({
    userId: new mongoose.Types.ObjectId(userId)
  })
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .skip(skip);
};

export const getUserFavorites = async (userId: string): Promise<IInteraction[]> => {
  return await Interaction.find({
    userId: new mongoose.Types.ObjectId(userId),
    favorite: true
  }).sort({ createdAt: -1 });
};

export const getChannelInteractions = async (channelId: string): Promise<IInteraction[]> => {
  return await Interaction.find({
    channelId: channelId.toUpperCase()
  }).sort({ interactionScore: -1 });
};

export const markFavorite = async (
  userId: string,
  channelId: string
): Promise<IInteraction | null> => {
  return await updateInteraction(userId, channelId, { favorite: true });
};

export const removeFavorite = async (
  userId: string,
  channelId: string
): Promise<IInteraction | null> => {
  return await updateInteraction(userId, channelId, { favorite: false });
};

export const getTopInteractions = async (
  limit: number = 20
): Promise<IInteraction[]> => {
  return await Interaction.find()
    .sort({ interactionScore: -1 })
    .limit(limit);
};

export const deleteInteraction = async (id: string): Promise<IInteraction | null> => {
  return await Interaction.findByIdAndDelete(id);
};

export const countInteractions = async (): Promise<number> => {
  return await Interaction.countDocuments();
};
