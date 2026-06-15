import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    name: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true,
      minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    resetToken: {
      type: String,
      default: undefined
    },
    resetTokenExpiry: {
      type: Date,
      default: undefined
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ resetToken: 1 });

userSchema.methods.toResponse = function(): UserResponse {
  return {
    id: this._id.toString(),
    email: this.email,
    name: this.name,
    role: this.role,
    createdAt: this.createdAt
  };
};

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser>('User', userSchema);
