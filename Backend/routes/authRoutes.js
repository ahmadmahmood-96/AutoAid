const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")

router.post('/register', authController.registerUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/change-password', authController.changePassword);
router.post('/login', authController.loginUser);
router.post('/chat', authController.chat);

module.exports = router;