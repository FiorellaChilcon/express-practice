import { DataValidationError, NotFoundError } from '@/domain/errors';
import { User } from '@/domain/models';
import { PgManager } from '@/infra/database';
import { UserRepository } from '@/infra/repos';
import express from 'express';
import { udpateUserValidator } from '@/main/validators';
const usersRouter = express.Router();

/* GET users listing. */
usersRouter.get('/', async function (req, res, next) {
  try {
    const users = new UserRepository();
    const response = await users.findAll();
    res.send(response.map(user => new User(user)));
  } catch(err) {
    next(err);
  }
});

usersRouter.get('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;
    const users = new UserRepository();
    const user = await users.findOneById(userId);
    if (user) res.send(new User(user));
    else throw new NotFoundError({ message: 'User not found' });
  } catch(err) {
    next(err);
  }
});

usersRouter.put('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;
    const newAttributes = req.body;

    const validation = udpateUserValidator.validate(newAttributes);

    if (validation.error) {
      throw new DataValidationError({ errors: validation.error.details });
    }

    const manager = new PgManager();
    const result = await manager.handleTransaction(async () => {
      const users = new UserRepository(manager);
      const user = await users.updateById(userId, newAttributes);
      return user;
    });
  
    if (result) {
      res.send(new User(result));
    } else {
      throw new NotFoundError({ message: 'User not found' });
    }
  } catch(err) {
    next(err);
  }
});

usersRouter.delete('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;
  
    const manager = new PgManager();
    const result = await manager.handleTransaction(async () => {
      const users = new UserRepository(manager);
      const user = await users.deleteById(userId);
      return user;
    });

    if (result) {
      res.send(new User(result));
    } else {
      throw new NotFoundError({ message: 'User not found' });
    }
  } catch(err) {
    next(err);
  }
});

export { usersRouter };
