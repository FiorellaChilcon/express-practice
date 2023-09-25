import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { usersRouter, rootRouter } from '@/main/routes';
import { QueryFailedError } from 'typeorm';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use((err: any, req: any, res: any, _: any) => {
  if (err instanceof QueryFailedError) {
    res.status(400).send({ error: 'Query execution has failed', message: err?.message });
  } else {
    res.status(500).send({ error: err?.message || err });
  }
});

export { app };
