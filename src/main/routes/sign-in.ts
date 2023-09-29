import { UserRepository } from '@/infra/repos';
import express from 'express';
import { signinValidator } from '@/main/validators';
import { DataValidationError, NotFoundError, UnauthorizedError } from '@/domain/errors';
import { TokenGateway } from '@/infra/gateways';
import { env } from '@/main/config';
import { User } from '@/domain/models';
import { BcryptGateway } from '@/infra/gateways/bcrypt';
import { TokenType } from '@/domain/contracts/models';

const signInRouter = express.Router();

signInRouter.post('/', async function(req, res, next) {
  try {
    const userInput = req.body;
    const validation = signinValidator.validate(userInput);

    if (validation.error) {
      throw new DataValidationError({ errors: validation.error.details });
    }

    const users = new UserRepository();
    const user = await users.findOneByEmailOrUsername(userInput.user);

    // Verify if user exists
    if (!user) {
      throw new NotFoundError({ message: 'User doesn\'t exist' });
    }

    // Verify password
    const password = userInput.password;
    const pwdEnccrypted = user.password;
    const passwordIsvalid = BcryptGateway.validate({ password, pwdEnccrypted });

    if (!passwordIsvalid) {
      throw new UnauthorizedError({ message: 'Invalid password' });
    }

    // Provide Token
    const tokenGateway = new TokenGateway(env.jwt.secretKey, env.jwt.expiresIn);
  
    const response =  {
      data: {
        user: new User(user),
        token: tokenGateway.createToken(user, TokenType.BEARER)
      }
    };

    res.send(response);
  } catch(err) {
    next(err);
  }
});

export { signInRouter };
