import { Router } from 'express';
import {
  watchChannelController,
  getUserHistoryController,
  getTrendingChannelsController,
  markFavoriteController,
  removeFavoriteController,
  getUserFavoritesController
} from '../controllers/interaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  validateWatchChannel,
  validateFavorite
} from '../validations/interaction.validation';

const router = Router();

router.post('/watch', authMiddleware, validateWatchChannel, watchChannelController);
router.get('/history', authMiddleware, getUserHistoryController);
router.get('/trending', getTrendingChannelsController);
router.post('/favorite', authMiddleware, validateFavorite, markFavoriteController);
router.delete('/favorite/:channelId', authMiddleware, removeFavoriteController);
router.get('/favorites', authMiddleware, getUserFavoritesController);

export default router;
