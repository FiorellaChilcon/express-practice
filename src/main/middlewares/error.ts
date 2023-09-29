import { DataValidationError, DataConflictError, UnauthorizedError } from '@/domain/errors';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

export const errorMiddleware = (err: any, req: Request, res: Response, _: any) => {
  if (err instanceof DataValidationError || err instanceof DataConflictError || err instanceof UnauthorizedError) {
    err.sendResponse(res);
  } else if (err instanceof QueryFailedError) {
    res.status(400).send({ error: 'Query execution has failed', message: err?.message });
  } else {
    const statusCode = err?.statusCode || 500;
    res.status(statusCode).json({ message: err?.message || err });
  }
};
