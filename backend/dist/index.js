"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const connect_1 = require("./src/config/connect");
const logger_1 = __importDefault(require("./src/utils/logger"));
app_1.default.listen(connect_1.PORT, () => {
    logger_1.default.info(`Server is up at http://localhost:${connect_1.PORT}`);
});
