import { Router } from 'express';
import { userController } from './user.controllers';
import { authRequired } from '../middlewares/authRequired';
import { validateRequest } from '../middlewares/validateRequest';
import { User, UserSignInData, UserInfo } from './user.validations';

export const userRouter = Router();

userRouter.post(
  '/users/signup',
  validateRequest({ body: User }),
  userController.signUpUser
);
userRouter.post(
  '/users/signin',
  validateRequest({ body: UserSignInData }),
  userController.signInUser
);
userRouter.get('/users', authRequired, userController.getAllUsers);
userRouter.get('/users/me', authRequired, userController.getMe);
userRouter.patch(
  '/users/me',
  authRequired,
  validateRequest({ body: UserInfo }),
  userController.updateMe
);

