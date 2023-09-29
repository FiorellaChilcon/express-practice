import { Response } from 'express';

export class UnauthorizedError {
  message: string;
  statusCode: number;

  constructor(input?: { message: string }) {
    this.message = input?.message || 'User is not authorized';
    this.statusCode = 403;
  }

  sendResponse(res: Response) {
    res.status(this.statusCode).send({ message: this.message });
  }
}
