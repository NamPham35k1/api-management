import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsersController,
  verifyOtpController,
  requestForgotOtpController,       
  resetPasswordWithOtpController,
  updateUserController,
  deleteUserController
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/register/verify', verifyOtpController);  
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/forgot-password/send-otp', requestForgotOtpController);
router.post('/forgot-password/reset', resetPasswordWithOtpController);

router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, validateChangePassword, changePassword);

// Admin routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsersController);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserController);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUserController);

export default router;
