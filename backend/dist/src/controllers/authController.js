"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = __importDefault(require("../models/auth"));
const authValidator_1 = __importDefault(require("../validators/authValidator"));
const logger_1 = __importDefault(require("../utils/logger"));
const crypto_1 = __importDefault(require("crypto"));
class AuthController {
    userModel;
    mailService;
    constructor(userModel, mailService) {
        this.userModel = userModel;
        this.mailService = mailService;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async register(req, res, _next) {
        try {
            const parsed = authValidator_1.default.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error });
            }
            const { email, password, username } = parsed.data;
            if (await this.userModel.findOne({ email })) {
                return res.error('User already exist', 400);
            }
            const salt = await bcrypt_1.default.genSalt(10);
            const hashed = await bcrypt_1.default.hash(password, salt);
            const user = new this.userModel({ email, password: hashed, username });
            await user.save();
            await this.mailService.sendEmail(user, "registeration sucessful");
            return res.success({
                id: user._id,
                email: user.email,
                username: user.username
            }, 'User created successfully');
        }
        catch (error) {
            logger_1.default.error('Registeration failed: ', error);
            return res.error('Registration failed', 500);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await this.userModel.findOne({ email });
            if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const userToken = { email: user.email, user_id: user._id };
            const accessToken = jsonwebtoken_1.default.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign(userToken, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d' });
            // Store refresh token
            user.refreshTokens = user.refreshTokens || [];
            user.refreshTokens.push({
                token: refreshToken,
                expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            });
            await user.save();
            // Set cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax"
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 2 * 24 * 60 * 60 * 1000,
                sameSite: "strict"
            });
            return res.success({
                accessToken,
                refreshToken,
                user: { email: user.email, name: user.username },
            }, 'Login successful');
        }
        catch (error) {
            res.error("Login Error", 500);
            logger_1.default.error('Login Error:', error);
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(403).json({
                    error: 'No refresh token provided',
                    code: 'MISSING_REFRESH_TOKEN'
                });
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await auth_1.default.findById(decoded.user_id);
            if (!user) {
                return res.status(403).json({
                    error: 'Invalid refresh token',
                    code: 'INVALID_USER'
                });
            }
            // Verify token exists and is not expired
            const tokenIndex = user.refreshTokens?.findIndex(t => t.token === refreshToken && new Date(t.expiresAt) > new Date());
            if (tokenIndex === -1) {
                return res.status(403).json({
                    error: 'Refresh token expired or invalid',
                    code: 'EXPIRED_REFRESH_TOKEN'
                });
            }
            // Generate new tokens
            const userToken = { email: user.email, user_id: user._id };
            const newAccessToken = jsonwebtoken_1.default.sign(userToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const newRefreshToken = jsonwebtoken_1.default.sign(userToken, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2d' });
            // Reload user to avoid version conflict
            const freshUser = await auth_1.default.findById(user._id);
            if (!freshUser) {
                return res.status(403).json({
                    error: 'User not found during token rotation',
                    code: 'USER_NOT_FOUND_REFRESH'
                });
            }
            freshUser.refreshTokens = freshUser.refreshTokens || [];
            freshUser.refreshTokens = freshUser.refreshTokens.filter(t => t.token !== refreshToken);
            freshUser.refreshTokens.push({
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            });
            await freshUser.save();
            // Set new cookies
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax"
            });
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 2 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax"
            });
            res.json({
                accessToken: newAccessToken,
                expiresIn: 15 * 60,
                message: 'Token refreshed successfully'
            });
        }
        catch (error) {
            logger_1.default.error('Refresh token error:', error);
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                path: '/'
            };
            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const user = await this.userModel.findById(decoded.user_id);
                    if (user) {
                        user.refreshTokens = user.refreshTokens?.filter(t => t.token !== refreshToken);
                        await user.save();
                    }
                }
                catch (error) {
                    logger_1.default.debug('Token cleanup skipped:', error);
                }
            }
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            logger_1.default.error('Logout error:', error);
            res.status(200).json({ message: 'Logged out successfully' });
            next(error);
        }
    }
    // forgot password - generate reset token
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await this.userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    error: 'User mot found'
                });
            }
            //generate reset token
            const resetToken = crypto_1.default.randomBytes(20).toString('hex');
            const resetTokenExpires = new Date(Date.now() + 3600000);
            user.resetPasswordToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            user.resetPasswordExpires = resetTokenExpires;
            await user.save();
            //send email with reset link
            const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
            await this.mailService.sendEmail(user, `reset message: ${resetUrl}`);
            res.json({ message: 'Password reset email sent' });
        }
        catch (error) {
            logger_1.default.error('Forgot passwor error:', error);
            next(error);
        }
    }
    // Reset Password
    async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            // Ensure token is provided
            if (!token) {
                return res.status(400).json({
                    error: 'Reset token is required'
                });
            }
            // Ensure password is provided
            if (!password) {
                return res.status(400).json({
                    error: 'Password is required'
                });
            }
            //hash the token to compare with the stored one
            const hashedToken = crypto_1.default
                .createHash('sha256')
                .update(token)
                .digest('hex');
            const user = await this.userModel.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).json({
                    error: 'Token is invalid or has expired'
                });
            }
            //update password
            const salt = await bcrypt_1.default.genSalt(10);
            user.password = await bcrypt_1.default.hash(password, salt);
            user.resetPasswordExpires = undefined;
            user.resetPasswordToken = undefined;
            await user.save();
            //send confirmation email
            await this.mailService.sendEmail(user, "password reset successful");
            res.json({
                message: 'Password updated successfully'
            });
        }
        catch (error) {
            logger_1.default.error('Reset Password Error:', error);
            next(error);
        }
    }
    // Get current user
    async me(req, res, next) {
        res.json(req.user || undefined);
        next();
    }
}
exports.default = AuthController;
