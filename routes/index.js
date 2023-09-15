const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ title: 'Learning Express' });
});

module.exports = router;
