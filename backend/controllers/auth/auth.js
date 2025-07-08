const Boom = require('boom');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const UserSchema = require('./validation');
const redis = require('../../config/redis');
const { signRefreshToken, signAccessToken, verifyRefreshToken } = require('../../helpers/jwt');
const sendEmail = require('../../utils/sendEmail');
const jwt = require('jsonwebtoken')




const Register = async (req, res, next) => {
    try {
        console.log("Register endpoint hit");
        const input = req.body;

        
        const { error } = UserSchema.validate(input);
        if (error) {
            return next(Boom.badRequest(error.details[0].message));
        }

        const isExists = await User.findOne({ email: input.email });
        if (isExists) {
            return next(Boom.conflict("This e-mail is already in use."));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(input.password, salt);

        const user = new User({ ...input, password: hashedPassword });
        const data = await user.save();

        const userData = data.toObject();
        delete userData.password;
        delete userData.__v;

        const accessToken = await signAccessToken({ user_id: user._id, role: user.role });
        const refreshToken = await signRefreshToken(user._id);

        res.status(201).json({
            user: userData,
            accessToken,
            refreshToken,
            message: 'Registration successful',
        });
    } catch (e) {
        console.error("Registration error:", e);
        next(e);
    }
};

const Login = async (req, res, next) => {
    try {
        const input = req.body;
        const { error } = UserSchema.validate(input);

        if (error) return next(Boom.badRequest(error.details[0].message));

        const user = await User.findOne({ email: input.email });
        if (!user) return next(Boom.notFound("The email address was not found."));

        const isMatched = await bcrypt.compare(input.password, user.password);
        if (!isMatched) return next(Boom.unauthorized("Incorrect email or password."));

        const accessToken = await signAccessToken({ user_id: user._id, role: user.role });
        const refreshToken = await signRefreshToken(user._id);

        const userData = user.toObject();
        delete userData.password;
        delete userData.__v;

        res.status(200).json({ user: userData, accessToken, refreshToken, message: 'Login successful' });
    } catch (e) {
        console.error("Login error:", e);
        next(e);
    }
};

const RefreshToken = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) return next(Boom.badRequest("Refresh token is required"));

        const user_id = await verifyRefreshToken(refresh_token);

        const accessToken = await signAccessToken(user_id);
        const refreshToken = await signRefreshToken(user_id);

        res.json({ accessToken, refreshToken });
    } catch (e) {
        console.error("Refresh token error:", e);
        next(e);
    }
};

const Logout = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) return next(Boom.badRequest("Refresh token is required"));

        const user_id = await verifyRefreshToken(refresh_token);
        const data = await redis.del(user_id);

        if (!data) return next(Boom.badRequest("Session not found or already logged out"));

        res.json({ message: "Logout successful" });
    } catch (e) {
        console.error("Logout error:", e);
        next(e);
    }
};

const Me = async (req, res, next) => {
    try {
        const { user_id } = req.payload;

        const user = await User.findById(user_id).select("-password -__v");
        if (!user) return next(Boom.notFound("User not found"));

        res.json(user);
    } catch (e) {
        console.error("Me endpoint error:", e);
        next(e);
    }
};


const ForgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(Boom.notFound("User not found"));
        }

        console.log("User email:", user.email); // Log email to debug
        console.log("User resetToken:", user.resetToken); // Log reset token for confirmation

        const resetToken = await signAccessToken({user_id : user.id});
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 60 *1000;
        await user.save();

        await sendEmail(user);

        res.json({ message: 'Reset email sent', resetToken });
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};


const ResetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user_id);

        console.log(user.resetToken)
        console.log(user)
        if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
            return next(Boom.badRequest('Invalid or expired token'));
        }
        

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password has been reset' });
    } catch (err) {
        console.error(err.message);
        next(err);
    }
};

 
module.exports = {
    Register,
    Login,
    RefreshToken,
    ResetPassword,
    RefreshToken,
    Logout,
    Me,
    ForgetPassword
};
