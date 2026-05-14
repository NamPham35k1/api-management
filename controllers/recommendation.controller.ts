import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { getRecommendationsForUser } from '../services/recommendation.service';
import { findChannelByChannelId } from '../repositories/channel.repository';

export const getRecommendationsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const recommendations = await getRecommendationsForUser(userId, limit);

    // Lấy thông tin chi tiết channel
    const enrichedRecommendations = await Promise.all(
      recommendations.map(async rec => {
        const channel = await findChannelByChannelId(rec.channelId);
        return {
          ...rec,
          channel: channel ? {
            id: channel._id,
            channelId: channel.channelId,
            name: channel.name,
            category: channel.category,
            logo: channel.logo
          } : null
        };
      })
    );

    res.status(200).json({
      message: 'Lấy recommendations thành công',
      data: enrichedRecommendations,
      total: enrichedRecommendations.length
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getRecommendationsByChannelController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      res.status(400).json({ message: 'channelId là bắt buộc' });
      return;
    }

    // Lấy channels cùng category
    const channel = await findChannelByChannelId(channelId);
    if (!channel) {
      res.status(404).json({ message: 'Channel không tồn tại' });
      return;
    }

    res.status(200).json({
      message: 'Lấy recommendations theo channel thành công',
      channel: {
        id: channel._id,
        name: channel.name,
        category: channel.category
      }
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};

export const getRecommendationsByGenreController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { genre } = req.params;

    if (!genre) {
      res.status(400).json({ message: 'genre là bắt buộc' });
      return;
    }

    res.status(200).json({
      message: 'Lấy recommendations theo genre thành công',
      genre: genre
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Lỗi server'
    });
  }
};
