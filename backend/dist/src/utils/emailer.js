"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
class MailService {
    transporter;
    constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email credentials are not configured');
        }
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            host: 'smpt-gmail',
            port: 465,
            secure: true,
            auth: {
                pass: process.env.EMAIL_PASS,
                user: process.env.EMAIL_USER
            }
        });
    }
    async sendEmail(user, message) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Welcome to shopulse ${user.username}`,
                text: `${message}`
            };
            const info = await this.transporter.sendMail(mailOptions);
            logger_1.default.info('Email sent:', info.response);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error('Error sending message to user:', error);
            }
            logger_1.default.error('Error sending email:', error);
        }
    }
}
exports.mailService = new MailService();
exports.default = MailService;
