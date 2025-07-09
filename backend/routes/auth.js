const express = require('express');
const { verifyRefreshToken, verifyAccessToken, signAccessToken } = require('../helpers/jwt');
const { Login, Logout, Me, RefreshToken, Register, ResetPassword, ForgetPassword } = require('../controllers/auth/auth');
const router = express.Router()


router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh_token', verifyRefreshToken, RefreshToken);
router.post('/logout', Logout);
router.get('/me', verifyAccessToken, Me);
// Reset password routes
router.post('/forget-password', ForgetPassword);
router.post('/reset-password',   ResetPassword);



module.exports = router