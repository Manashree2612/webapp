const express = require("express");
const { fetchUser, createUser, updateUser } = require('../controllers/user.controller.js');
const validateAuthToken = require('../controllers/auth.controller.js')
const router = express.Router();

router.get('/self', validateAuthToken, fetchUser);
router.post('/', createUser);
router.put('/self', validateAuthToken, updateUser);

module.exports = router;