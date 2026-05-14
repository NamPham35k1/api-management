// routes/channel.routes.ts

import { Router } from 'express';
import {
  createChannel,
  getAllChannelsController,
  getChannelsByCategoryController,
  searchChannelsController,
  updateChannelController,
  deleteChannelController
} from '../controllers/channel.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  createChannel
);

router.get(
  '/',
  getAllChannelsController
);

router.get(
  '/category/:category',
  getChannelsByCategoryController
);

router.get(
  '/search',
  searchChannelsController
);

router.put(
  '/:id',
  authMiddleware,
  updateChannelController
);

router.delete(
  '/:id',
  authMiddleware,
  deleteChannelController
);

export default router;
