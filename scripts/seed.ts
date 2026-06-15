import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/user.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/api-management';

const seedData = async () => {
  try {
    // Kết nối database
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Xóa dữ liệu cũ (nếu có)
    await User.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Tạo user test
    const testUser = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test Admin',
      role: 'admin'
    });

    console.log('Đã tạo user test:');
    console.log('Email: test@example.com');
    console.log('Password: 123456');
    console.log('ID:', testUser._id);

    // Đóng kết nối
    await mongoose.connection.close();
    console.log('Hoàn thành seed data');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();
