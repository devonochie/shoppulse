
import AuthController from '../../controllers/auth.controller'
import { authMiddleware } from '../../middleware/http.middleware'
import User from '../../models/auth'
import { mailService } from '../../utils/emailer'
import express from 'express'

const routes: express.Router = express.Router()

const authController = new AuthController(User, mailService)

routes.post('/register', authController.register.bind(authController))
routes.post('/login', authController.login.bind(authController))
routes.get('/me', authMiddleware, authController.me.bind(authController)); 
routes.post('/logout', authController.logout.bind(authController))
routes.post('/forgot-password', authController.forgotPassword.bind(authController))
routes.post('/reset-password/:token', authController.resetPassword.bind(authController))
routes.post('/refresh-token', authController.refreshToken.bind(authController))

export default routes