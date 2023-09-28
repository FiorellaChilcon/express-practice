import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { usersRouter, rootRouter, signUpRouter } from '@/main/routes';
import { QueryFailedError } from 'typeorm';
import { DataConflictError, DataValidationError } from '@/domain/errors';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/** Routes */
app.use('/', rootRouter);
app.use('/sign-up', signUpRouter);
app.use('/users', usersRouter);
/** Routes */

app.use((err: any, req: Request, res: Response, _: any) => {
  if (err instanceof DataValidationError || err instanceof DataConflictError) {
    err.sendResponse(res);
  } else if (err instanceof QueryFailedError) {
    res.status(400).send({ error: 'Query execution has failed', message: err?.message });
  } else {
    const statusCode = err?.statusCode || 500;
    res.status(statusCode).json({ message: err?.message || err });
  }
});

export { app };
