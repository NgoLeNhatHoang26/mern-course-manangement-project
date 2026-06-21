import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

if (process.env.NODE_ENV !== 'test') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    dotenv.config({ path: path.resolve(process.cwd(), '../.env'), override: false });
}
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),

    JWT_SECRET: z.string().min(1).default('dev-jwt-secret'),
    JWT_REFRESH_SECRET: z.string().min(1).default('dev-refresh-secret'),
    JWT_EXPIRES: z.string().min(1).default('15m'),

    MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/course-management'),
    REDIS_URL: z.string().optional(),
    CLIENT_URL: z.string().url().default('http://localhost:3000'),

    MAIL_USER: z.string().optional(),
    MAIL_PASS: z.string().optional(),

    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;
