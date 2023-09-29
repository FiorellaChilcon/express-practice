import { PgManager } from '@/infra/database';
import { UserRepository } from '@/infra/repos';
import express from 'express';
import { signupValidator } from '@/main/validators';
import { DataValidationError, DataConflictError } from '@/domain/errors';
import { TokenGateway } from '@/infra/gateways';
import { env } from '@/main/config';
import { TokenType } from '@/domain/contracts/models';
import { User } from '@/domain/models';

const signUpRouter = express.Router();

signUpRouter.post('/', async function(req, res, next) {
  try {
    const newUser = req.body;
    const validation = signupValidator.validate(newUser);

    if (validation.error) {
      throw new DataValidationError({ errors: validation.error.details });
    }

    const users = new UserRepository();

    // Verify if email or username is already registered
    if (await users.findOne({ email: newUser.email })) {
      throw new DataConflictError({ message: 'email already registered' });
    }
    if (await users.findOne({ username: newUser.username })) {
      throw new DataConflictError({ message: 'username already in used' });
    }

    // Save user and provide token
    const pgManager = new PgManager();
    const tokenGateway = new TokenGateway(env.jwt.secretKey, env.jwt.expiresIn);

    await pgManager.handleTransaction(async () => {
      const users = new UserRepository(pgManager);
      const user = await users.create(newUser);

      const response =  {
        data: {
          user: new User(user),
          token: tokenGateway.createToken(user, TokenType.BEARER)
        }
      };

      res.send(response);
    });
  } catch(err) {
    next(err);
  }
});

export { signUpRouter };
