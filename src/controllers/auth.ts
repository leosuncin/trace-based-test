import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import type { Login, Register, User } from '../interfaces/auth';
import UserModel from '../models/user';

declare module 'express-session' {
  interface SessionData {
    user: Readonly<User>;
  }
}

const router = Router();

router.post(
  '/auth/register',
  asyncHandler(
    async (
      request: Request<never, User, Register>,
      response: Response<User>,
    ) => {
      const { name, email, password } = request.body;
      const count = await UserModel.count({ email });

      if (count > 0) {
        throw createError(StatusCodes.CONFLICT, 'Email already exists');
      }

      const user = new UserModel({
        name,
        email,
        password,
      });

      await user.save();
      request.session.user = user.toJSON();

      response.status(StatusCodes.CREATED).json(user.toJSON());
    },
  ),
);

router.post(
  '/auth/login',
  asyncHandler(
    async (request: Request<never, User, Login>, response: Response<User>) => {
      const { email, password } = request.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw createError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
      }

      const isCorrectPassword = await user.matchPassword(password);

      if (!isCorrectPassword) {
        throw createError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
      }

      request.session.user = user.toJSON();

      response.status(StatusCodes.OK).json(user.toJSON());
    },
  ),
);

export default router;
