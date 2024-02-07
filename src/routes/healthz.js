const express = require('express');
const { handleGetRequest, handleRetrictedMethods } = require('../controllers/healthz.controller.js');

const router = express.Router();

router.get('/', handleGetRequest);
// Middleware to send an error response for non-GET requests
router.use((req, res, next) => handleRetrictedMethods(req, res, next));

module.exports = router;
