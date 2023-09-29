import Joi from 'joi';

export const signinValidator = Joi.object({
  user: Joi.string().required(),
  password: Joi.string().required()
});
