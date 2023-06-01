import { logger } from './../utils/Logger';
import { ZodError } from 'zod';
import { AppError } from './../utils/AppError';
import { NextFunction, Response, Request } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(err.message);

    return res.status(err.statusCode).json(err.serializeError());
  }

  if (err instanceof ZodError) {
    const { message } = err.errors[0];
    logger.error(message);

    return res.status(400).json({
      message,
      statusCode: 400,
    });
  }

  logger.error(err.message);

  return res.status(500).json({ message: 'Server error', statusCode: 500 });
};
