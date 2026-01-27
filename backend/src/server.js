import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import  router from './routes/index.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Cho phép React gọi
    credentials: true,
}));
router(app);
dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port: http://localhost:${PORT}`)
    connectDB();
});