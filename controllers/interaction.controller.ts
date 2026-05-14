// controllers/interaction.controller.ts

import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  watchChannel,
  getUserHistory,
  getTrendingChannels,
  markFavorite,
  removeFavorite,
  getUserFavoritesService
} from '../services/interaction.service';

export const watchChannelController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { channelId, watchDuration, favorite } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!channelId) {
      res.status(400).json({ message: 'channelId là bắt buộc' });
      return;
    }

    const interaction = await watchChannel(userId, channelId, watchDuration, favorite);

    res.status(200).json({
      message: 'Cập nhật interaction thành công',
      interaction
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getUserHistoryController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const history = await getUserHistory(userId, limit, skip);

    res.status(200).json({
      message: 'Lấy lịch sử xem thành công',
      history,
      total: history.length
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getTrendingChannelsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const trending = await getTrendingChannels(limit);

    res.status(200).json({
      message: 'Lấy channels trending thành công',
      trending,
      total: trending.length
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const markFavoriteController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { channelId } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!channelId) {
      res.status(400).json({ message: 'channelId là bắt buộc' });
      return;
    }

    await markFavorite(userId, channelId);

    res.status(200).json({
      message: 'Đã thêm vào yêu thích'
    });
  } catch (error: any) {
    const statusCode = error.message.includes('chưa xem') ? 400 : 500;
    res.status(statusCode).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const removeFavoriteController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { channelId } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!channelId) {
      res.status(400).json({ message: 'channelId là bắt buộc' });
      return;
    }

    await removeFavorite(userId, channelId);

    res.status(200).json({
      message: 'Đã xóa khỏi yêu thích'
    });
  } catch (error: any) {
    const statusCode = error.message.includes('chưa xem') ? 400 : 500;
    res.status(statusCode).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getUserFavoritesController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const favorites = await getUserFavoritesService(userId);

    res.status(200).json({
      message: 'Lấy danh sách yêu thích thành công',
      favorites,
      total: favorites.length
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};
