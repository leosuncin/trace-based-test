import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Error as MongooseError } from 'mongoose';

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

function transformValidationError(
  error: MongooseError.ValidationError,
): ValidationError {
  const errors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(error.errors)) {
    if (key in errors) {
      (errors[key] as string[]).push(value.message);
    } else {
      errors[key] = [value.message];
    }
  }

  return {
    message: 'Validation errors',
    errors,
  };
}

export function validationError(
  error: unknown,
  _: Request,
  response: Response<ValidationError>,
  next: NextFunction,
) {
  if (error instanceof MongooseError.ValidationError) {
    response
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json(transformValidationError(error));
  } else {
    next(error);
  }
}
