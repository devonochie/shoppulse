"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./src/config/db"));
const logger_1 = __importDefault(require("./src/utils/logger"));
const router_1 = __importDefault(require("./src/routes/router"));
const httpMiddleware_1 = require("./src/middleware/httpMiddleware");
const errorhandler_1 = __importDefault(require("./src/middleware/errorhandler"));
const responseExtensions_1 = __importDefault(require("./src/middleware/responseExtensions"));
dotenv_1.default.config();
// express app initialization
const app = (0, express_1.default)();
// morgan config
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms :user-agent'));
morgan_1.default.token('user-agent', (req) => req.headers['user-agent']);
morgan_1.default.token('body', (req) => JSON.stringify(req.body));
// app middleware
app.use(express_1.default.static('dist'));
// cors config
app.use((0, cors_1.default)());
// app middleware
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(httpMiddleware_1.requestLogger);
app.use(responseExtensions_1.default);
// initializing Database....
db_1.default
    .then(() => logger_1.default.info('Connected to Database'))
    .catch((error) => logger_1.default.error('Error connecting to database', error));
// app routing
app.use("/api/v1", router_1.default);
// unknown endPoint handler
app.use(httpMiddleware_1.unknownEndPoint);
// error handling
app.use(errorhandler_1.default);
exports.default = app;
