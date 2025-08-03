"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoute_1 = __importDefault(require("./auth/authRoute"));
const router = express_1.default.Router();
// Api routes
router.use('/auth', authRoute_1.default);
// Health check endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
});
// 404 handler for API routes
router.use((_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
exports.default = router;
