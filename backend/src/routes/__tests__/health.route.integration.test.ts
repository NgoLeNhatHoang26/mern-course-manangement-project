import { describe, expect, it, vi, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('health.route integration', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('GET /health — 200 khi MongoDB UP và Redis DISABLED', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const data = response.body.data;
        expect(data.status).toBe('UP');
        expect(typeof data.timestamp).toBe('string');
        expect(typeof data.uptime).toBe('number');

        // MongoDB phải UP (MongoMemoryServer đang chạy)
        expect(data.dependencies.mongodb.status).toBe('UP');
        expect(typeof data.dependencies.mongodb.latencyMs).toBe('number');

        // Redis DISABLED vì không có REDIS_URL trong môi trường test
        expect(data.dependencies.redis.status).toBe('DISABLED');
        expect(typeof data.dependencies.redis.message).toBe('string');
    });

    it('GET /health — 503 khi MongoDB DOWN', async () => {
        const healthService = await import('../../services/health.service.js');
        vi.spyOn(healthService, 'getHealthReport').mockResolvedValueOnce({
            isHealthy: false,
            report: {
                status: 'DEGRADED',
                timestamp: new Date().toISOString(),
                uptime: 10,
                dependencies: {
                    mongodb: { status: 'DOWN', message: 'Not connected' },
                    redis: { status: 'DISABLED', message: 'REDIS_URL not configured' },
                },
            },
        });

        const response = await request(app).get('/health');

        expect(response.status).toBe(503);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('DEGRADED');
        expect(response.body.data.dependencies.mongodb.status).toBe('DOWN');
    });

    it('GET /health — 503 khi Redis DOWN (REDIS_URL có nhưng không kết nối được)', async () => {
        const healthService = await import('../../services/health.service.js');
        vi.spyOn(healthService, 'getHealthReport').mockResolvedValueOnce({
            isHealthy: false,
            report: {
                status: 'DEGRADED',
                timestamp: new Date().toISOString(),
                uptime: 10,
                dependencies: {
                    mongodb: { status: 'UP', latencyMs: 1 },
                    redis: { status: 'DOWN', message: 'Connection refused' },
                },
            },
        });

        const response = await request(app).get('/health');

        expect(response.status).toBe(503);
        expect(response.body.data.dependencies.redis.status).toBe('DOWN');
    });
});
