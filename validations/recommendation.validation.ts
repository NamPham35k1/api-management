import { Request, Response, NextFunction } from 'express';

export const validateGetRecommendations = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { limit } = req.query;

  if (limit) {
    const limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      res.status(400).json({
        message: 'Limit phải là số từ 1 đến 100'
      });
      return;
    }
  }

  next();
};

export const validateChannelId = (
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

export const validateGenre = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { genre } = req.params;

  if (!genre || genre.trim().length === 0) {
    res.status(400).json({
      message: 'genre là bắt buộc'
    });
    return;
  }

  next();
};
