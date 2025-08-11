import mongoose, { Schema, Document, Model } from 'mongoose';
import {User as UserValidators} from '../validators/auth.validator';



interface RefreshToken {
  token: string;
  expiresAt: Date;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator"
}

// Define the shape of the User fields
interface IUser extends  UserValidators{
  refreshTokens: RefreshToken[],
  role: UserRole
}

// Extend Mongoose's Document type
export interface UserDocument extends IUser, Document {}

const userSchema: Schema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshTokens: [
    {
      token: { type: String},
      expiresAt: { type: Date, default: Date.now}
    }
  ],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date, default: Date.now },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  avatar: { type: String },

}, { timestamps: true });

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);

export default User;
