import { z } from 'zod';

const defaultImage =
  'https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67';

export const User = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Email is not valid' }),
    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(6, { message: 'Password length must be greater than 5' }),
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(3, { message: 'Name length must be greater than 2' }),
    avatar: z
      .string()
      .trim()
      .url({ message: 'Avatar must be a valid URL' })
      .default(defaultImage),
    group: z
      .string()
      .trim()
      .startsWith('group-', { message: 'Group must starts with "group-"' })
      .default('group-11'),
    about: z
      .string()
      .trim()
      .nonempty({ message: "About can't be empty" })
      .default('Customer'),
  })
  .strict();

export const UserInfo = User.pick({
  name: true,
  avatar: true,
  about: true,
}).strict();

export const UserSignInData = User.pick({
  email: true,
  password: true,
}).strict();
