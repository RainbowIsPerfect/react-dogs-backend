import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { NextFunction, Request, Response } from 'express';
import {
  UserModel,
  UserWithId,
  UserInfoType,
  SignInUserType,
  UserWithoutPassword,
  UserType,
} from './user.model';
import { LocalsType } from '../products/product.contollers';

type SignInData = {
  data: UserWithoutPassword;
  token: string;
};

const signUpUser = async (
  req: Request<{}, UserWithoutPassword, UserType>,
  res: Response<UserWithoutPassword>,
  next: NextFunction
) => {
  try {
    const isExisting = await UserModel.findOne({ email: req.body.email });
    if (isExisting) {
      res.status(409);
      throw new Error('User with this email already exists');
    }
    const { insertedId } = await UserModel.insertOne(req.body, {});
    console.log(insertedId);
    const user = await UserModel.findOne({ _id: insertedId });

    if (!user) {
      return res.status(400);
    }

    const { password, ...userData } = user;

    return res.status(200).json(userData);
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
    const dbuser = await UserModel.findOne(req.body);

    if (!dbuser) {
      res.status(404);
      throw new Error('Wrong email or password');
    }

    const token = jwt.sign(
      {
        _id: dbuser._id,
      },
      config.token.key
    );

    const { password, ...userData } = dbuser;

    return res.status(200).json({ data: userData, token });
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
    const users = await UserModel.find().toArray();
    const usersWithoutPassword = users.map(
      ({ password, ...userData }) => userData
    );

    return res.status(200).json(usersWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const getMe = async (
  req: Request,
  res: Response<UserWithoutPassword, LocalsType>,
  next: NextFunction
) => {
  try {
    const currentUser = await UserModel.findOne({
      email: res.locals.user.email,
    });

    if (!currentUser) {
      res.status(404);
      throw new Error("User doesn't exist");
    }

    const { password, ...userData } = currentUser;

    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

const updateMe = async (
  req: Request<{}, UserWithId, UserInfoType>,
  res: Response<UserWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const currentUser = await UserModel.findOneAndUpdate(
      res.locals.user,
      {
        $set: req.body,
      },
      {
        returnDocument: 'after',
      }
    );

    if (!currentUser.value) {
      res.status(404);
      throw new Error('User not found');
    }

    return res.status(200).json(currentUser.value);
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
