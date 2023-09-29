import { Response } from 'express';

export class DataConflictError {
  message: string;
  statusCode: number;

  constructor({ message }: { message: string }) {
    this.message = message;
    this.statusCode = 400;
  }

  sendResponse(res: Response) {
    res.status(this.statusCode).send({ message: this.message });
  }
}
