const express = require("express");
const { fetchUser, createUser, updateUser } = require('../controllers/user.controller.js');
const validateAuthToken = require('../controllers/auth.controller.js')
const { handleRetrictedMethods } = require('../controllers/healthz.controller.js');
const router = express.Router();

router.get('/self', validateAuthToken, fetchUser);
router.post('/', createUser);
router.put('/self', validateAuthToken, updateUser);

// Middleware to send an error response for non-GET requests
router.use((req, res, next) => handleRetrictedMethods(req, res, next));

module.exports = router;