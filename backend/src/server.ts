import dotenv from 'dotenv';
import path from 'path'
dotenv.config({
    path: process.env.NODE_ENV === 'production'
        ? undefined 
        : path.resolve(__dirname, '../../.env')
});

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './lib/db.js'
import router from './routes/index.js'
import {errorMiddleware} from "./middleware/error.middleware.js";
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec} from "./config/swagger.js";
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { connectRedis } from './lib/redis.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Course Management API Docs',
}))

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser())
app.use('/api', globalRateLimiter);

router(app)
app.use(errorMiddleware)
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port: http://localhost:${PORT}`)
    connectDB();
    connectRedis();
});