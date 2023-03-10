import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function routeNotFound(_: Request, response: Response) {
  response.status(StatusCodes.NOT_FOUND).json({
    message: 'API endpoint does not exist',
  });
}
