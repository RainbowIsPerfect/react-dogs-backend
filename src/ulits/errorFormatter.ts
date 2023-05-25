import { ValidationError } from 'express-validator';

export const errorFormatter = (error: ValidationError[]) => {
  const currentError = error[0];
  switch (currentError.type) {
    case 'field':
      return {
        message: `${currentError.msg} in ${currentError.path} field`,
        statusCode: 400,
      };
    case 'alternative':
      return { message: currentError.msg, statusCode: 400 };
    case 'alternative_grouped':
      return { message: currentError.msg, statusCode: 400 };
    case 'unknown_fields':
      return { message: currentError.msg, statusCode: 400 };
    default:
      return { message: currentError, statusCode: 400 };
  }
};
