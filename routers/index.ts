import { Router } from 'express';
import authRoutes from './auth.router';
import channelRoutes from './channel.router';
import interactionRoutes from './interaction.router';
import recommendationRoutes from './recommendation.router';

const router = Router();

router.use('/auth', authRoutes);
router.use('/channels', channelRoutes);
router.use('/interactions', interactionRoutes);
router.use('/recommendations', recommendationRoutes);

export default router;
