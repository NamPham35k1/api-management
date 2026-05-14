import {
  upsertInteraction,
  getUserInteractions,
  getChannelInteractions,
  getUserFavorites,
  markFavorite as markFavoriteRepo,
  removeFavorite as removeFavoriteRepo,
  findInteraction
} from '../repositories/interaction.repository';
import { Interaction } from '../models/interaction.model';
import { findChannelByChannelId } from '../repositories/channel.repository';

export const watchChannel = async (
  userId: string,
  channelId: string,
  watchDuration: number = 0,
  favorite: boolean = false
) => {
  // Kiểm tra channel tồn tại
  const channel = await findChannelByChannelId(channelId);
  if (!channel) {
    throw new Error('Channel không tồn tại');
  }

  return await upsertInteraction(userId, channelId, watchDuration, favorite);
};

export const getUserHistory = async (userId: string, limit: number = 20, skip: number = 0) => {
  const interactions = await getUserInteractions(userId, limit, skip);

  const enrichedHistory = await Promise.all(
    interactions.map(async interaction => {
      const channel = await findChannelByChannelId(interaction.channelId);
      return {
        channelId: interaction.channelId,
        channelName: channel?.name || 'Unknown',
        category: channel?.category,
        watchDuration: interaction.watchDuration,
        clickCount: interaction.clickCount,
        favorite: interaction.favorite,
        interactionScore: interaction.interactionScore,
        lastWatchedAt: interaction.lastWatchedAt
      };
    })
  );

  return enrichedHistory;
};

export const getChannelAnalytics = async (channelId: string) => {
  return await getChannelInteractions(channelId);
};

export const getTrendingChannels = async (limit: number = 10) => {
  const result = await Interaction.aggregate([
    {
      $group: {
        _id: '$channelId',
        totalScore: { $sum: '$interactionScore' },
        totalWatchDuration: { $sum: '$watchDuration' },
        totalClicks: { $sum: '$clickCount' },
        favoriteCount: { $sum: { $cond: ['$favorite', 1, 0] } }
      }
    },
    { $sort: { totalScore: -1 } },
    { $limit: limit }
  ]);

  return result;
};

export const markFavorite = async (userId: string, channelId: string) => {
  const channel = await findChannelByChannelId(channelId);
  if (!channel) {
    throw new Error('Channel không tồn tại');
  }

  const interaction = await findInteraction(userId, channelId);
  if (!interaction) {
    throw new Error('Bạn chưa xem channel này');
  }

  return await markFavoriteRepo(userId, channelId);
};

export const removeFavorite = async (userId: string, channelId: string) => {
  const interaction = await findInteraction(userId, channelId);
  if (!interaction) {
    throw new Error('Bạn chưa xem channel này');
  }

  return await removeFavoriteRepo(userId, channelId);
};

export const getUserFavoritesService = async (userId: string) => {
  const favorites = await getUserFavorites(userId);

  const enrichedFavorites = await Promise.all(
    favorites.map(async fav => {
      const channel = await findChannelByChannelId(fav.channelId);
      return {
        channelId: fav.channelId,
        channelName: channel?.name || 'Unknown',
        category: channel?.category,
        logo: channel?.logo,
        country: channel?.country,
        language: channel?.language,
        addedAt: fav.createdAt
      };
    })
  );

  return enrichedFavorites;
};
