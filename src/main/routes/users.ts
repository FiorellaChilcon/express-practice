import express from 'express';
import { DataValidationError, NotFoundError } from '@/domain/errors';
import { User } from '@/domain/models';
import { PgManager } from '@/infra/database';
import { UserRepository } from '@/infra/repos';
import { udpateUserValidator } from '@/main/validators';
import { RedisManager } from '@/infra/gateways';
import { User as UserEntity } from '@/infra/entity';

const usersRouter = express.Router();

const ALL_USERS_CACHE_KEY = 'all_users';
const ALL_USERS_CACHE_EXP = 60 * 60 * 24; // 1 day

/* GET users listing. */
usersRouter.get('/', async function (req, res, next) {
  try {
    // Look data in cache
    const usersCached = await RedisManager.get(ALL_USERS_CACHE_KEY);
    if (usersCached) {
      const cacheData = JSON.parse(usersCached) as UserEntity[];
      return res.send({ data: cacheData.map(user => new User(user)), metadata: { cache: true } });
    }

    const users = new UserRepository();
    const response = await users.findAll();

    // Save data in cache
    await RedisManager.set(ALL_USERS_CACHE_KEY, JSON.stringify(response), { EX: ALL_USERS_CACHE_EXP });
 
    res.send({ data: response.map(user => new User(user)), metadata: { cache: false } });
  } catch(err) {
    next(err);
  }
});

usersRouter.get('/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;

    // Look data in cache
    const userCached = await RedisManager.get(userId);
    if (userCached) {
      const cacheData = JSON.parse(userCached) as UserEntity;
      return res.send({ data: new User(cacheData), metadata: { cache: true } });
    }

    const users = new UserRepository();
    const user = await users.findOneById(userId);
    if (user) {
      // Save data in cache
      await RedisManager.set(userId, JSON.stringify(user));

      return res.send({ data: new User(user), metadata: { cache: false } });
    } else {
      throw new NotFoundError({ message: 'User not found' });
    }
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
      // Save/Update data in cache
      await RedisManager.set(userId, JSON.stringify(result));

      return res.send(new User(result));
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
      // Remove data in cache
      await RedisManager.del(userId);

      return res.send(new User(result));
    } else {
      throw new NotFoundError({ message: 'User not found' });
    }
  } catch(err) {
    next(err);
  }
});

export { usersRouter };
