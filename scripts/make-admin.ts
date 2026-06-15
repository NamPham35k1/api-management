import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-management';

const makeAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    const email = 'admin@example.com';
    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      user = await User.create({
        email,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'admin'
      });
      console.log('Đã tạo tài khoản admin mới:', email, 'Pass: 123456');
    } else {
      user.role = 'admin';
      await user.save();
      console.log('Đã nâng cấp quyền admin cho:', email);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
};

makeAdmin();
