import jwt from 'jsonwebtoken';
import { AppError } from './AppError';
import { Types } from 'mongoose';
import { config } from '../config';

export const generateAccsessToken = (_id: Types.ObjectId): string => {
  return jwt.sign(
    {
      _id,
    },
    config.token.key
  );
};

export const validateAccsessToken = (token: string): string => {
  const currentToken = token.replace('Bearer ', '');
  const decodedToken = jwt.verify(currentToken, config.token.key);

  if (!(typeof decodedToken === 'object' && '_id' in decodedToken)) {
    throw new AppError('Auth required', 401);
  }

  return decodedToken._id as string;
};
