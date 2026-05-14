import { Request, Response, NextFunction } from 'express';

export const validateWatchChannel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { channelId, watchDuration, favorite } = req.body;

  if (!channelId || typeof channelId !== 'string' || channelId.trim().length === 0) {
    res.status(400).json({
      message: 'channelId là bắt buộc và phải là chuỗi'
    });
    return;
  }

  if (watchDuration !== undefined && (typeof watchDuration !== 'number' || watchDuration < 0)) {
    res.status(400).json({
      message: 'watchDuration phải là số >= 0'
    });
    return;
  }

  if (favorite !== undefined && typeof favorite !== 'boolean') {
    res.status(400).json({
      message: 'favorite phải là boolean'
    });
    return;
  }

  next();
};

export const validateFavorite = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { channelId } = req.body;

  if (!channelId || typeof channelId !== 'string' || channelId.trim().length === 0) {
    res.status(400).json({
      message: 'channelId là bắt buộc'
    });
    return;
  }

  next();
};

export const validateRemoveFavorite = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { channelId } = req.params;

  if (!channelId || channelId.trim().length === 0) {
    res.status(400).json({
      message: 'channelId là bắt buộc'
    });
    return;
  }

  next();
};
