import { UserType } from './../types';
import { Schema, model } from 'mongoose';

export const userSchema = new Schema<UserType>({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  group: { type: String, required: true },
  about: { type: String, required: true },
});

export const UserModel = model<UserType>('users', userSchema);
