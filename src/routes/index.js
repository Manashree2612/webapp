const express = require('express');
const healthzRouter = require('./healthz.js');
const userRouter = require('./user.js');

const router = express.Router();

router.use('/healthz', healthzRouter);
router.use('/v1/user', userRouter);

module.exports = router;
