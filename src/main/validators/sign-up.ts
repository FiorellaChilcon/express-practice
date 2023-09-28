import Joi from 'joi';

export const signupValidator = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(32).required(),
  confirmPassword: Joi.ref('password')
}).with('password', 'confirmPassword');
