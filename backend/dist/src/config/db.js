"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const connect_1 = require("./connect");
dotenv_1.default.config();
mongoose_1.default.set('strictQuery', false);
if (!connect_1.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}
const db = mongoose_1.default.connect(connect_1.MONGO_URI);
exports.default = db;
