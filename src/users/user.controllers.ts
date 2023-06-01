import { logger } from './../utils/Logger';
import { AppError } from './../utils/AppError';
import { generateAccsessToken } from '../utils/tokenHelpers';
import { NextFunction, Request, Response } from 'express';
import { UserModel } from './user.model';
import {
  LocalsType,
  SignInData,
  UserType,
  UserWithoutPassword,
  SignInUserType,
  UserInfoType,
} from '../types';

const signUpUser = async (
  req: Request<{}, UserWithoutPassword, UserType>,
  res: Response<UserWithoutPassword>,
  next: NextFunction
) => {
  try {
    logger.processing(`Creating user with email: ${req.body.email} ...`);
    const isExisting = await UserModel.findOne({ email: req.body.email });

    if (isExisting) {
      throw new AppError('User with this email already exists', 409);
    }

    const user = await UserModel.create(req.body);
    const { password, ...data } = user.toJSON();
    logger.success('User was created');

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

const signInUser = async (
  req: Request<{}, SignInData, SignInUserType>,
  res: Response<SignInData>,
  next: NextFunction
) => {
  try {
    logger.processing(`Signing in user with email: ${req.body.email} ...`);
    const dbuser = await UserModel.findOne(req.body).select('-password');

    if (!dbuser) {
      throw new AppError('Wrong email or password');
    }

    const token = generateAccsessToken(dbuser._id);

    logger.success('User was successfully signed in');

    return res.json({ data: dbuser, token });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (
  req: Request,
  res: Response<UserWithoutPassword[]>,
  next: NextFunction
) => {
  try {
    logger.processing('Getting all users...');
    const users = await UserModel.find().select('-password');
    logger.success('Users was successfully received');
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

const getMe = async (
  req: Request,
  res: Response<UserWithoutPassword, LocalsType>,
  next: NextFunction
) => {
  logger.success('User was successfully received');
  return res.json(res.locals.user);
};

const updateMe = async (
  req: Request<{}, UserType, UserInfoType>,
  res: Response<UserType, LocalsType>,
  next: NextFunction
) => {
  try {
    logger.processing('Updating profile...');
    const currentUser = await UserModel.findOneAndUpdate(
      { _id: res.locals.user._id },
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      }
    ).select('-password');

    if (!currentUser) {
      throw new AppError('User not found');
    }

    logger.success('Profile was updated');

    return res.json(currentUser);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  signUpUser,
  signInUser,
  getAllUsers,
  getMe,
  updateMe,
};
