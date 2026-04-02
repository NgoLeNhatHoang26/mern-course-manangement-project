import 'dotenv/config';

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './lib/db.js'
import router from './routes/index.js'
import {errorMiddleware} from "./middleware/error.middleware.js";
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec} from "./config/swagger.js";

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Course Management API Docs',
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173', // Cho phép React gọi
    credentials: true,
}));

router(app)
app.use(errorMiddleware)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port: http://localhost:${PORT}`)
    connectDB();
});