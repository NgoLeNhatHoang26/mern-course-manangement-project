import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'user' },
}));

const controllerMocks = vi.hoisted(() => ({
    enrollCourse: vi.fn(),
    getMyEnrollments: vi.fn(),
    checkEnrollment: vi.fn(),
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = authState.user;
        next();
    },
}));

vi.mock('../../controller/enrollment.controller.js', () => controllerMocks);

describe('enrollment.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'user' };
    });

    it('POST /api/enrollments forwards to enrollCourse', async () => {
        controllerMocks.enrollCourse.mockImplementation((_req, res) => {
            res.status(201).json({ _id: 'e1', courseId: 'c1', userId: 'u1' });
        });

        const response = await request(app)
            .post('/api/enrollments')
            .send({ courseId: 'c1' });

        expect(response.status).toBe(201);
        expect(response.body.data.courseId).toBe('c1');
        expect(controllerMocks.enrollCourse).toHaveBeenCalledTimes(1);
    });

    it('GET /api/enrollments/me forwards to getMyEnrollments', async () => {
        controllerMocks.getMyEnrollments.mockImplementation((_req, res) => {
            res.status(200).json([{ _id: 'e1', courseId: 'c1' }]);
        });

        const response = await request(app).get('/api/enrollments/me');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(controllerMocks.getMyEnrollments).toHaveBeenCalledTimes(1);
    });

    it('GET /api/enrollments/:courseId/check forwards to checkEnrollment', async () => {
        controllerMocks.checkEnrollment.mockImplementation((_req, res) => {
            res.status(200).json({ isEnrolled: true });
        });

        const response = await request(app).get('/api/enrollments/c1/check');

        expect(response.status).toBe(200);
        expect(response.body.data.isEnrolled).toBe(true);
        expect(controllerMocks.checkEnrollment).toHaveBeenCalledTimes(1);
    });
});
