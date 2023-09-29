import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { usersRouter, rootRouter, signUpRouter, signInRouter } from '@/main/routes';
import { authMiddleware, errorMiddleware } from '@/main/middlewares';

const app = express();

/** Middlewares */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/** Middlewares */

/** Routes */
app.use('/', rootRouter);
app.use('/sign-up', signUpRouter);
app.use('/sign-in', signInRouter);
app.use('/users', authMiddleware, usersRouter);
/** Routes */

/** Error handler */
app.use(errorMiddleware);
/** Error handler */

export { app };
