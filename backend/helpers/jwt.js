const JWT = require('jsonwebtoken');
const Boom = require('boom');
const redis = require('../config/redis');

const signAccessToken = (data) => {
    const payload = { ...data };
    const options = { expiresIn: "1h", issuer: "ecommerce.app" };
    const secret = process.env.JWT_SECRET;

    return new Promise((resolve, reject) => {
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.error("Error signing access token:", err);
                return reject(Boom.internal("Failed to sign access token"));
            }
            resolve(token);
        });
    });
};

const verifyAccessToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return next(Boom.unauthorized("Access token is required"));
    }

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error verifying access token:", err);
            return next(
                Boom.unauthorized(
                    err.name === "JsonWebTokenError" ? "Invalid token" : "Token expired"
                )
            );
        }

        req.user = decoded;
        next();
    });
};

const signRefreshToken = (user_id) => {
    const payload = { user_id };
    const options = { expiresIn: "1hr", issuer: "ecommerce.app" };

    return new Promise((resolve, reject) => {
        JWT.sign(payload, process.env.JWT_SECRET, options, async (err, token) => {
            if (err) {
                console.error("Error signing refresh token:", err);
                return reject(Boom.internal("Failed to sign refresh token"));
            }

            try {
                await redis.set(user_id, token, "EX", 60 * 60); // 180 days
                resolve(token);
            } catch (redisError) {
                console.error("Error storing refresh token in Redis:", redisError);
                reject(Boom.internal("Failed to store refresh token"));
            }
        });
    });
};

const verifyRefreshToken = (refresh_token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refresh_token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) {
                console.error("Error verifying refresh token:", err);
                return reject(Boom.unauthorized("Invalid or expired refresh token"));
            }

            const user_id  = payload;

            try {
                const storedToken = await redis.get(user_id);

                if (!storedToken || storedToken !== refresh_token) {
                    return reject(Boom.unauthorized("Refresh token mismatch or not found"));
                }

                resolve(user_id);
            } catch (redisError) {
                console.error("Error accessing Redis:", redisError);
                reject(Boom.internal("Failed to validate refresh token"));
            }
        });
    });
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
