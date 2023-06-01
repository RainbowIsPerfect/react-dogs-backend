import { NextFunction, Request, Response } from 'express';
import { AppError } from './../utils/AppError';
import { UserModel } from '../users/user.model';
import { validateAccsessToken } from '../utils/tokenHelpers';

export const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError('Auth required', 401);
    }

    const decodedToken = validateAccsessToken(token);
    const dbUser = await UserModel.findById(decodedToken).select('-password');

    if (!dbUser) {
      throw new AppError('Auth required', 401);
    }

    res.locals.user = dbUser;
    next();
  } catch (error) {
    next(error);
  }
};
