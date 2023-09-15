const express = require('express');
const router = express.Router();

const users = [];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

router.get('/:id', function(req, res, next) {
  const userId = req.params.id;
  const user = users.find(user => user.id == userId);
  if (user) res.send(user)
  else res.status(404).send("Not found");
});

router.put('/:id', function(req, res, next) {
  const userId = req.params.id;
  const userIndex = users.findIndex(user => user.id == userId);
  if (userIndex >= 0) {
    const newAttributes = req.body;
    const user = users[userIndex];
    const userUpdated  = { ...user, ...newAttributes };
    users[userIndex] = userUpdated;
    res.send(users[userIndex]);
  } else {
    res.status(404).send("Not found");
  }
});

router.delete('/:id', function(req, res, next) {
  const userId = req.params.id;
  const userIndex = users.findIndex(user => user?.id == userId);
  if (userIndex >= 0) {
    const userToDelete = users[userIndex];
    users.splice(userIndex, 1);
    res.send(userToDelete);
  } else {
    res.status(404).send("Not found");
  }
});

router.post('/', function(req, res, next) {
  const newUser = req.body;
  if (Object.keys(newUser).includes('id')) {
    users.push(newUser);
    res.send(newUser);
  } else {
    res.status(400).send("Bad request");
  }
});

module.exports = router;
