import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import router from './routes/index.js'
import {errorMiddleware} from "./middleware/error.middleware.js";
import { responseFormatMiddleware } from './middleware/responseFormat.middleware.js';
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec} from "./config/swagger.js";
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { AppError } from './utils/AppError.js';

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
app.use(responseFormatMiddleware);

router(app)
app.use((req, res, next) => {
    next(new AppError('Route not found', 404));
});
app.use(errorMiddleware)

export default app;