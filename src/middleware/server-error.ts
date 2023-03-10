import type { NextFunction, Request, Response } from 'express';
import { isHttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';

export function serverError(
  error: unknown,
  _: Request,
  response: Response,
  next: NextFunction,
) {
  if (!error) {
    return next();
  }

  if (isHttpError(error)) {
    response.status(error.statusCode).json(error);
  } else if (error instanceof Error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}
