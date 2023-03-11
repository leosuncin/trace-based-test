import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import type { Register, User } from '../interfaces/auth';
import UserModel from '../models/user';

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

      response.status(StatusCodes.CREATED).json(user.toJSON());
    },
  ),
);

export default router;
