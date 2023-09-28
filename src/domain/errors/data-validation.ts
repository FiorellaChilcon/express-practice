import { Response } from 'express';
import Joi from 'joi';

export class DataValidationError {
  _errors: Joi.ValidationErrorItem[];
  statusCode: number;

  constructor({ errors }: { errors: Joi.ValidationErrorItem[] }) {
    this._errors = errors;
    this.statusCode = 400;
  }

  get errors() {
    return this._errors.map(err => {
      return { path: err.path, message: err.message };
    });
  }

  sendResponse(res: Response) {
    res.status(this.statusCode).send({ errors: this.errors });
  }
}
