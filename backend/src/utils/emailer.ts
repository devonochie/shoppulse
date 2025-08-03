import nodemailer from "nodemailer";
import dotenv  from 'dotenv'
import logger from "./logger";
import { UserDocument } from "../models/auth";
dotenv.config()


class MailService {
    private transporter;

    constructor() {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Email credentials are not configured')
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smpt-gmail',
            port: 465,
            secure: true,
            auth: {
                pass: process.env.EMAIL_PASS,
                user: process.env.EMAIL_USER

            }
        })
    }

    async sendEmail(user: UserDocument, message : string): Promise <void> {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Welcome to shopulse ${user.username}`,
                text:   `${message}`
            }

            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Email sent:',info.response)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error('Error sending message to user:', error)
            }
            logger.error('Error sending email:', error);
        }

    }
}

export const mailService = new MailService()

export default MailService


