import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { User } from '../models/user.model';

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Không tìm thấy xác thực' });
      return;
    }

    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ Admin mới được phép thực hiện.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực quyền Admin' });
  }
};
