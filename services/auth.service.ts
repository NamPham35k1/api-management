import bcrypt from 'bcryptjs';
import { generateToken, generateResetToken } from '../helpers/jwt.helper';
import { 
  findUserByEmail, 
  createUser, 
  updateUser, 
  findUserByResetToken,
  findUserById,
  getAllUsers as getAllUsersRepo
} from '../repositories/user.repository';
import { IUser, UserResponse } from '../models/user.model';

const userToResponse = (user: IUser): UserResponse => ({
  id: user._id.toString(),
  email: user.email,
  name: user.name,
  createdAt: user.createdAt
});

export const registerUser = async (email: string, password: string, name: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await createUser({
    email,
    password: hashedPassword,
    name
  });

  const accessToken = generateToken(newUser._id.toString());

  return {
    accessToken
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  const accessToken = generateToken(user._id.toString());

  return {
    accessToken
  };
};

export const getUserProfile = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  return userToResponse(user);
};

export const getAllUsers = async (limit?: number, skip?: number): Promise<UserResponse[]> => {
  const users = await getAllUsersRepo(limit, skip);
  return users.map(userToResponse);
};

export const requestPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return { resetToken: null };
  }

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
  if (!user) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn');
  }

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
  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu hiện tại không đúng');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await updateUser(user._id.toString(), {
    password: hashedPassword
  } as Partial<IUser>);

  return true;
};
