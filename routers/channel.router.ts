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
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
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
  adminMiddleware,
  updateChannelController
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteChannelController
);

export default router;
