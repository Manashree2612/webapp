const express = require('express');
const healthzRouter = require('./healthz.js');

const router = express.Router();

router.use('/healthz', healthzRouter);

module.exports = router;
