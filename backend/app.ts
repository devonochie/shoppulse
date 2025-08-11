import dotenv from 'dotenv';
import cron from "node-cron";
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import db from './src/config/db';
import logger from './src/utils/logger';
import router from './src/routes/router';
import { requestLogger, unknownEndPoint } from './src/middleware/http.middleware';
import errorHandler from "./src/middleware/error.handler"
import responseExtensions from './src/middleware/response.extensions';
import generateDailyAnalytics from './src/utils/services/cronAnalytic';


dotenv.config()

// express app initialization
const app: express.Application = express()

// morgan config
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :user-agent'));
morgan.token('user-agent', (req: express.Request) => req.headers['user-agent']);
morgan.token('body', (req: express.Request) => JSON.stringify(req.body));

// app middleware
app.use(express.static('dist'))

// cors config
app.use(cors())

// cron job
cron.schedule("0 0 * * *", generateDailyAnalytics);

// app middleware
app.use(cookieParser()) 
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(requestLogger)
app.use(responseExtensions)

// initializing Database....
db
    .then(() => logger.info('Connected to Database'))
    .catch((error: unknown) => logger.error('Error connecting to database', error))

// app routing
app.use("/api/v1", router)

// unknown endPoint handler
app.use(unknownEndPoint)

// error handling
app.use(errorHandler)


export  default app