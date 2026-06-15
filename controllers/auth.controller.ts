import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  registerUser,
  loginUser,
  getUserProfile,
  requestPasswordReset,
  resetUserPassword,
  changeUserPassword,
  getAllUsers,
  countUsers,
  updateUser,
  deleteUser,
  verifyOtp,
  requestForgotOtp,
  resetPasswordWithOtp
} from '../services/auth.service';

// auth.controller.ts - hàm register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }

    const result = await registerUser(email, password, name);

    res.status(201).json(result); // bỏ message trùng, trả result thẳng
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Lỗi server' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Vui lòng điền email và mật khẩu' });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      message: 'Đăng nhập thành công',
      ...result
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Lỗi server' });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
      return;
    }

    const user = await getUserProfile(userId);

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message || 'Lỗi server' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Vui lòng nhập email' });
      return;
    }

    const { resetToken } = await requestPasswordReset(email);

    res.status(200).json({ 
      message: 'Nếu email tồn tại, link reset mật khẩu đã được gửi',
      // Chỉ để test, trong production không nên trả về token
      resetToken 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: 'Vui lòng cung cấp token và mật khẩu mới' });
      return;
    }

    await resetUserPassword(token, newPassword);

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Lỗi server' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
      return;
    }

    await changeUserPassword(userId, currentPassword, newPassword);

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Lỗi server' });
  }
};

export const getAllUsersController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

    const users = await getAllUsers(limit, skip);
    const total = await countUsers();

    res.status(200).json({ users, total });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: 'Không tìm thấy user' });
      return;
    }
    res.status(200).json({ message: 'Cập nhật thành công', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      res.status(404).json({ message: 'Không tìm thấy user' });
      return;
    }
    res.status(200).json({ message: 'Xóa user thành công' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};
export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: 'Vui lòng nhập email và OTP' });
      return;
    }

    const result = await verifyOtp(email, otp);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Lỗi server' });
  }
};


// forgot
export const requestForgotOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
      return;
    }
    const result = await requestForgotOtp(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Lỗi server' });
  }
};

export const resetPasswordWithOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin' });
      return;
    }
    const result = await resetPasswordWithOtp(email, otp, newPassword);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Lỗi server' });
  }
};