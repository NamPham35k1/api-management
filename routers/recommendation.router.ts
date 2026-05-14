// routes/recommendation.routes.ts

import { Router } from 'express';
import {
  getRecommendationsController,
  getRecommendationsByChannelController,
  getRecommendationsByGenreController
} from '../controllers/recommendation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  validateGetRecommendations,
  validateChannelId,
  validateGenre
} from '../validations/recommendation.validation';

const router = Router();

router.get('/', authMiddleware, validateGetRecommendations, getRecommendationsController);
router.get('/channel/:channelId', validateChannelId, getRecommendationsByChannelController);
router.get('/genre/:genre', validateGenre, getRecommendationsByGenreController);

export default router;
