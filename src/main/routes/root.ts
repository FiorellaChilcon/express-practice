import express from 'express';
const rootRouter = express.Router();

rootRouter.get('/', function(req, res) {
  res.json({ title: 'Learning Express' });
});

export { rootRouter };
