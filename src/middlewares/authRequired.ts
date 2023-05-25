import { UserModel } from '../users/user.model';
import { config } from '../config/index';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const authRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Auth required' });
  }

  try {
    const currentToken = token.replace('Bearer ', '');

    const decodedToken = jwt.verify(currentToken, config.token.key);

    if (!(typeof decodedToken === 'object' && '_id' in decodedToken)) {
      res.status(401);
      throw new Error('Auth required');
    }

    const { _id } = decodedToken;

    const dbUser = await UserModel.findOne({ _id: new ObjectId(_id) });

    if (!dbUser) {
      res.status(401);
      throw new Error('Auth required');
    }

    res.locals.user = dbUser;
    next();
  } catch (error) {
    return next(error);
  }
};
