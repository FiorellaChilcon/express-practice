import Joi from 'joi';

export const udpateUserValidator = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30),
  lastName: Joi.string().alphanum().min(3).max(30),
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(32),
  confirmPassword: Joi.ref('password')
}).min(1).with('password', 'confirmPassword');
