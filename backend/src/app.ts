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
import { env } from './config/env.js';

const app = express();

// Render/Cloudflare gửi X-Forwarded-For — cần bật để express-rate-limit hoạt động đúng
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(cors({
    origin: env.CLIENT_URL,
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