import { NextFunction, Response, Request } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  // console.log(err.message);
  
  res.status(statusCode);
  res.json({
    message: err.message,
    statusCode
  });
}