import { UserRepository } from '@/infra/repos';
import express from 'express';
const usersRouter = express.Router();

/* GET users listing. */
usersRouter.get('/', async function (req, res) {
  const users = new UserRepository();
  const response = await users.findAll();
  res.send(response);
});

usersRouter.get('/:id', async function(req, res) {
  const userId = req.params.id;
  const users = new UserRepository();
  const user = await users.findOneById(userId);
  if (user) res.send(user);
  else res.status(404).send('Not found');
});

usersRouter.put('/:id', async function(req, res) {
  const userId = req.params.id;
  const newAttributes = req.body;

  const users = new UserRepository();
  const user = await users.updateById(userId, newAttributes);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send('Not found');
  }
});

usersRouter.delete('/:id', async function(req, res) {
  const userId = req.params.id;

  const users = new UserRepository();
  const user = await users.deleteById(userId);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send('Not found');
  }
});

usersRouter.post('/', async function(req, res) {
  const newUser = req.body;

  const users = new UserRepository();
  const user = await users.create(newUser);

  res.send(user);
});

export { usersRouter };
