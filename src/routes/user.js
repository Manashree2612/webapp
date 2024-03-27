const express = require("express");
const { fetchUser, createUser, updateUser, verifyUserEmail } = require('../controllers/user.controller.js');
const validateAuthToken = require('../controllers/auth.controller.js')
const router = express.Router();

router.get('/self', validateAuthToken, fetchUser);
router.post('/', createUser);
router.put('/self', validateAuthToken, updateUser);
router.get('/verify-email', verifyUserEmail);

module.exports = router;