import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('health.route integration', () => {
    it('GET /health returns service health payload', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('UP');
        expect(typeof response.body.data.timestamp).toBe('string');
        expect(typeof response.body.data.uptime).toBe('number');
    });
});
