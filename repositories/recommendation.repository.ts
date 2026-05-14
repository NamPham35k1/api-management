import { Recommendation, IRecommendation } from '../models/recommendation.model';

export const createRecommendation = async (
  recommendationData: {
    userId: string;
    channelId: string;
    score: number;
    reason: string;
    algorithm: 'collaborative' | 'content-based' | 'trending' | 'hybrid';
  }
): Promise<IRecommendation> => {
  const recommendation = new Recommendation(recommendationData);
  return await recommendation.save();
};

export const findRecommendationsByUserId = async (
  userId: string,
  limit: number = 10,
  skip: number = 0
): Promise<IRecommendation[]> => {
  return await Recommendation.find({ userId })
    .sort({ score: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

export const findRecommendationById = async (id: string): Promise<IRecommendation | null> => {
  return await Recommendation.findById(id);
};

export const updateRecommendation = async (
  id: string,
  updates: Partial<IRecommendation>
): Promise<IRecommendation | null> => {
  return await Recommendation.findByIdAndUpdate(id, { $set: updates }, { new: true });
};

export const deleteRecommendation = async (id: string): Promise<IRecommendation | null> => {
  return await Recommendation.findByIdAndDelete(id);
};

export const deleteRecommendationsByUserId = async (userId: string): Promise<void> => {
  await Recommendation.deleteMany({ userId });
};

export const findRecommendationByUserAndChannel = async (
  userId: string,
  channelId: string
): Promise<IRecommendation | null> => {
  return await Recommendation.findOne({ userId, channelId });
};

export const getTrendingRecommendations = async (
  limit: number = 10
): Promise<IRecommendation[]> => {
  return await Recommendation.find()
    .sort({ score: -1, createdAt: -1 })
    .limit(limit);
};

export const countRecommendationsByUserId = async (userId: string): Promise<number> => {
  return await Recommendation.countDocuments({ userId });
};
