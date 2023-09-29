import { Response } from 'express';

export class NotFoundError {
  message: string;
  statusCode: number;

  constructor({ message }: { message: string }) {
    this.message = message;
    this.statusCode = 404;
  }

  sendResponse(res: Response) {
    res.status(this.statusCode).send({ message: this.message });
  }
}
