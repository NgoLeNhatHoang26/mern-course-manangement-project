import mongoose from 'mongoose';
import { redisClient } from '../lib/redis.js';
import { env } from '../config/env.js';

export type DependencyStatus = 'UP' | 'DOWN' | 'DISABLED';

export type DependencyCheck = {
    status: DependencyStatus;
    message?: string;
    latencyMs?: number;
};

export type HealthReport = {
    status: 'UP' | 'DEGRADED';
    timestamp: string;
    uptime: number;
    dependencies: {
        mongodb: DependencyCheck;
        redis: DependencyCheck;
    };
};

async function checkMongoDB(): Promise<DependencyCheck> {
    const start = Date.now();
    try {
        if (mongoose.connection.readyState !== 1) {
            return { status: 'DOWN', message: 'Not connected' };
        }
        await mongoose.connection.db!.admin().ping();
        return { status: 'UP', latencyMs: Date.now() - start };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Ping failed';
        return { status: 'DOWN', message };
    }
}

async function checkRedis(): Promise<DependencyCheck> {
    if (!env.REDIS_URL) {
        return { status: 'DISABLED', message: 'REDIS_URL not configured' };
    }
    if (!redisClient) {
        return { status: 'DISABLED', message: 'Redis client not initialised' };
    }

    const start = Date.now();
    try {
        const pong = await redisClient.ping();
        if (pong !== 'PONG') {
            return { status: 'DOWN', message: `Unexpected ping response: ${pong}` };
        }
        return { status: 'UP', latencyMs: Date.now() - start };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Ping failed';
        return { status: 'DOWN', message };
    }
}

export async function getHealthReport(): Promise<{
    report: HealthReport;
    isHealthy: boolean;
}> {
    const [mongodb, redis] = await Promise.all([checkMongoDB(), checkRedis()]);

    const mongoDown = mongodb.status === 'DOWN';
    const redisDown = redis.status === 'DOWN';
    const isHealthy = !mongoDown && !redisDown;

    const report: HealthReport = {
        status: isHealthy ? 'UP' : 'DEGRADED',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        dependencies: { mongodb, redis },
    };

    return { report, isHealthy };
}
