import bcrypt from 'bcryptjs';
import { generateToken, generateResetToken } from '../helpers/jwt.helper';
import { sendOtpEmail } from '../helpers/mailer.helper'; // thêm
import { 
  findUserByEmail, 
  createUser, 
  updateUser, 
  findUserByResetToken,
  findUserById,
  getAllUsers as getAllUsersRepo
} from '../repositories/user.repository';
import { IUser, UserResponse } from '../models/user.model';

// -------------------------
// OTP pending store
// -------------------------

const pendingRegister = new Map<string, {
  email: string;
  hashedPassword: string;
  name: string;
  otp: string;
  expiredAt: number;
}>();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// -------------------------
// Helpers
// -------------------------

const userToResponse = (user: IUser): UserResponse => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  createdAt: user.createdAt
});

// -------------------------
// Auth
// -------------------------

// Bước 1: Gửi OTP, CHƯA tạo account
export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  const otp = generateOtp();
  const hashedPassword = await bcrypt.hash(password, 10);

  pendingRegister.set(email, {
    email,
    hashedPassword,
    name,
    otp,
    expiredAt: Date.now() + 5 * 60 * 1000,
  });

  await sendOtpEmail(email, otp);

  return { success: true, message: 'OTP đã gửi tới email của bạn' };
};

// Bước 2: Verify OTP → tạo account → trả JWT
export const verifyOtp = async (email: string, otp: string) => {
  const pending = pendingRegister.get(email);

  if (!pending) throw new Error('Không tìm thấy yêu cầu đăng ký');
  if (Date.now() > pending.expiredAt) {
    pendingRegister.delete(email);
    throw new Error('OTP đã hết hạn');
  }
  // Master OTP: Nếu nhập 999999 thì luôn luôn cho qua (dùng khi bảo vệ đồ án nếu email bị lỗi)
  if (pending.otp !== otp && otp !== '999999') throw new Error('OTP không đúng');

  pendingRegister.delete(email);

  const newUser = await createUser({
    email: pending.email,
    password: pending.hashedPassword,
    name: pending.name,
  });

  const accessToken = generateToken(newUser._id.toString());

  return {
    success: true,
    accessToken,
    userId: newUser._id.toString(),
    name: newUser.name,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Email hoặc mật khẩu không đúng');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Email hoặc mật khẩu không đúng');

  const accessToken = generateToken(user._id.toString());

  return {
    accessToken,
    userId: user._id.toString(),
    name: user.name
  };
};

// -------------------------
// User
// -------------------------

export const getUserProfile = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');
  return userToResponse(user);
};

export const getAllUsers = async (limit?: number, skip?: number): Promise<UserResponse[]> => {
  const users = await getAllUsersRepo(limit, skip);
  return users.map(userToResponse);
};

// -------------------------
// Password
// -------------------------

export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) return { resetToken: null };

  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 3600000);

  await updateUser(user._id.toString(), {
    resetToken,
    resetTokenExpiry
  } as Partial<IUser>);

  console.log(`Reset token cho ${email}: ${resetToken}`);
  return { resetToken };
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  const user = await findUserByResetToken(token);
  if (!user) throw new Error('Token không hợp lệ hoặc đã hết hạn');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await updateUser(user._id.toString(), {
    password: hashedPassword,
    resetToken: undefined,
    resetTokenExpiry: undefined
  } as Partial<IUser>);

  return true;
};

export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) throw new Error('Mật khẩu hiện tại không đúng');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await updateUser(user._id.toString(), {
    password: hashedPassword
  } as Partial<IUser>);

  return true;
};