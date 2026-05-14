import { Request, Response, NextFunction } from 'express';

export const validateCreateChannel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { channelId, name, streamUrl } = req.body;

  if (!channelId || typeof channelId !== 'string' || channelId.trim().length === 0) {
    res.status(400).json({ message: 'channelId là bắt buộc' });
    return;
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ message: 'Tên channel phải có ít nhất 2 ký tự' });
    return;
  }

  if (!streamUrl || typeof streamUrl !== 'string' || streamUrl.trim().length === 0) {
    res.status(400).json({ message: 'Stream URL là bắt buộc' });
    return;
  }

  next();
};

export const validateUpdateChannel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, category, streamUrl } = req.body;

  if (name && (typeof name !== 'string' || name.trim().length < 2)) {
    res.status(400).json({ message: 'Tên channel phải có ít nhất 2 ký tự' });
    return;
  }

  if (streamUrl && (typeof streamUrl !== 'string' || streamUrl.trim().length === 0)) {
    res.status(400).json({ message: 'Stream URL không hợp lệ' });
    return;
  }

  next();
};

export const validateSearchChannel = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { query } = req.params;

  if (!query || query.trim().length === 0) {
    res.status(400).json({ message: 'Query là bắt buộc' });
    return;
  }

  next();
};
