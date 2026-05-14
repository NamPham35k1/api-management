import {
  createRecommendation,
  findRecommendationsByUserId,
  deleteRecommendationsByUserId,
  findRecommendationByUserAndChannel
} from '../repositories/recommendation.repository';
import { Interaction } from '../models/interaction.model';
import { Channel } from '../models/channel.model';
import { User } from '../models/user.model';

interface RecommendationResult {
  channelId: string;
  score: number;
  reason: string;
  algorithm: string;
}

// Collaborative Filtering: Tìm users có sở thích giống nhau
export const collaborativeFiltering = async (userId: string): Promise<RecommendationResult[]> => {
  try {
    // Lấy channels mà user này yêu thích
    const userInteractions = await Interaction.find({
      userId,
      $or: [{ favorite: true }, { interactionScore: { $gt: 50 } }]
    });

    if (userInteractions.length === 0) {
      return [];
    }

    const userChannelIds = userInteractions.map(i => i.channelId);

    // Tìm users khác có sở thích tương tự
    const similarUsers = await Interaction.aggregate([
      {
        $match: {
          userId: { $ne: userId },
          channelId: { $in: userChannelIds }
        }
      },
      {
        $group: {
          _id: '$userId',
          commonChannels: { $sum: 1 },
          avgScore: { $avg: '$interactionScore' }
        }
      },
      { $sort: { commonChannels: -1 } },
      { $limit: 5 }
    ]);

    const recommendations: RecommendationResult[] = [];

    // Lấy channels mà những users tương tự xem nhưng user hiện tại chưa xem
    for (const similarUser of similarUsers) {
      const similarUserChannels = await Interaction.find(
        { userId: similarUser._id },
        { channelId: 1 }
      );

      const similarChannelIds = similarUserChannels
        .map(i => i.channelId)
        .filter(id => !userChannelIds.includes(id));

      for (const channelId of similarChannelIds) {
        const interaction = await Interaction.findOne({
          userId: similarUser._id,
          channelId
        });

        if (interaction) {
          const score = Math.min(100, (interaction.interactionScore || 50) * 0.8);
          recommendations.push({
            channelId,
            score,
            reason: 'Người dùng có sở thích tương tự đang xem',
            algorithm: 'collaborative'
          });
        }
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Collaborative filtering error:', error);
    return [];
  }
};

// Content-Based Filtering: Recommend channels tương tự category/genre
export const contentBasedFiltering = async (userId: string): Promise<RecommendationResult[]> => {
  try {
    // Lấy channels user yêu thích
    const userFavorites = await Interaction.find({
      userId,
      favorite: true
    });

    if (userFavorites.length === 0) {
      return [];
    }

    // Lấy categories của các channels yêu thích
    const favoriteChannels = await Channel.find({
      channelId: { $in: userFavorites.map(i => i.channelId) }
    });

    const categories = [...new Set(favoriteChannels.map(c => c.category).filter(c => c))];

    if (categories.length === 0) {
      return [];
    }

    // Tìm channels cùng category nhưng user chưa xem
    const viewedChannelIds = await Interaction.find({ userId }, { channelId: 1 });
    const viewedIds = viewedChannelIds.map(i => i.channelId);

    const similarChannels = await Channel.find({
      $and: [
        { category: { $in: categories } },
        { channelId: { $nin: viewedIds } }
      ]
    }).limit(20);

    // Tính score dựa trên độ tương đồng
    const recommendations: RecommendationResult[] = similarChannels.map(channel => ({
      channelId: channel.channelId,
      score: 70,
      reason: `Channel tương tự với category: ${channel.category}`,
      algorithm: 'content-based'
    }));

    return recommendations;
  } catch (error) {
    console.error('Content-based filtering error:', error);
    return [];
  }
};

// Trending: Channels đang hot
export const trendingChannels = async (): Promise<RecommendationResult[]> => {
  try {
    const trendingInteractions = await Interaction.aggregate([
      {
        $group: {
          _id: '$channelId',
          totalViews: { $sum: '$clickCount' },
          totalWatchTime: { $sum: '$watchDuration' },
          favoriteCount: {
            $sum: { $cond: ['$favorite', 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalViews: 1,
          totalWatchTime: 1,
          favoriteCount: 1,
          score: {
            $add: [
              { $multiply: ['$totalViews', 0.3] },
              { $multiply: ['$totalWatchTime', 0.4] },
              { $multiply: ['$favoriteCount', 0.3] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 20 }
    ]);

    const maxScore = Math.max(...trendingInteractions.map(i => i.score), 1);

    return trendingInteractions.map(item => ({
      channelId: item._id,
      score: Math.min(100, (item.score / maxScore) * 100),
      reason: 'Channel đang trending hiện nay',
      algorithm: 'trending'
    }));
  } catch (error) {
    console.error('Trending channels error:', error);
    return [];
  }
};

// Hybrid: Kết hợp cả 3 thuật toán
export const generateHybridRecommendations = async (
  userId: string,
  limit: number = 20
): Promise<any[]> => {
  try {
    const [collaborative, contentBased, trending] = await Promise.all([
      collaborativeFiltering(userId),
      contentBasedFiltering(userId),
      trendingChannels()
    ]);

    // Merge và normalize scores
    const recommendationMap = new Map<string, RecommendationResult>();

    // Thêm collaborative (weight 40%)
    collaborative.forEach(rec => {
      const existing = recommendationMap.get(rec.channelId);
      const weightedScore = rec.score * 0.4;
      recommendationMap.set(rec.channelId, {
        ...rec,
        score: (existing?.score || 0) + weightedScore,
        reason: `${rec.reason} + ${existing?.reason || ''}`
      });
    });

    // Thêm content-based (weight 40%)
    contentBased.forEach(rec => {
      const existing = recommendationMap.get(rec.channelId);
      const weightedScore = rec.score * 0.4;
      recommendationMap.set(rec.channelId, {
        ...rec,
        score: (existing?.score || 0) + weightedScore,
        reason: `${existing?.reason || ''} + ${rec.reason}`
      });
    });

    // Thêm trending (weight 20%)
    trending.forEach(rec => {
      const existing = recommendationMap.get(rec.channelId);
      const weightedScore = rec.score * 0.2;
      recommendationMap.set(rec.channelId, {
        ...rec,
        score: Math.min(100, (existing?.score || 0) + weightedScore),
        algorithm: 'hybrid'
      });
    });

    // Convert to array và sort by score
    const recommendations = Array.from(recommendationMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Lưu vào database
    await deleteRecommendationsByUserId(userId);
    for (const rec of recommendations) {
      await createRecommendation({
        userId,
        channelId: rec.channelId,
        score: rec.score,
        reason: rec.reason,
        algorithm: 'hybrid'
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Hybrid recommendation error:', error);
    return [];
  }
};

export const getRecommendationsForUser = async (userId: string, limit: number = 20) => {
  try {
    // Kiểm tra recommendations mới nhất
    const existingRecommendations = await findRecommendationsByUserId(userId, limit);

    // Nếu không có hoặc quá cũ (> 24h), generate lại
    if (
      existingRecommendations.length === 0 ||
      (existingRecommendations.length > 0 &&
        Date.now() - existingRecommendations[0].createdAt.getTime() > 24 * 60 * 60 * 1000)
    ) {
      return await generateHybridRecommendations(userId, limit);
    }

    return existingRecommendations.map(rec => ({
      channelId: rec.channelId,
      score: rec.score,
      reason: rec.reason,
      algorithm: rec.algorithm
    }));
  } catch (error) {
    console.error('Get recommendations error:', error);
    return [];
  }
};
