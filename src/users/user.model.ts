import { WithId } from 'mongodb';
import { z } from 'zod';
import { db } from '../db';

const defaultImage =
  'https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67';

export const UserSignInData = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const User = UserSignInData.extend({
  name: z.string().nonempty(),
  avatar: z.string().url().default(defaultImage),
  group: z.string().default('group-11'),
  about: z.string().default('Customer'),
});

export const UserInfo = User.pick({ name: true, avatar: true, about: true });

export const UserModel = db.collection<UserType>('users');

export type UserType = z.infer<typeof User>;
export type SignInUserType = z.infer<typeof UserSignInData>;
export type UserInfoType = z.infer<typeof UserInfo>;
export type UserWithId = WithId<UserType>;
export type UserWithoutPassword = Omit<UserWithId, 'password'>;