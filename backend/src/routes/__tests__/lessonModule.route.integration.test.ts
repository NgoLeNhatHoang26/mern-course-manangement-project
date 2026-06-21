import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'admin' },
}));

const controllerMocks = vi.hoisted(() => ({
    getLessonModulesByCourseController: vi.fn(),
    getLessonModuleByIdController: vi.fn(),
    createLessonModuleController: vi.fn(),
    updateLessonModuleController: vi.fn(),
    deleteLessonModuleController: vi.fn(),
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = authState.user;
        next();
    },
}));

vi.mock('../../controller/lessonModule.controller.js', () => controllerMocks);

describe('lessonModule.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'admin' };
    });

    it('GET /api/courses/:courseId/modules forwards to getLessonModulesByCourseController', async () => {
        controllerMocks.getLessonModulesByCourseController.mockImplementation((_req, res) => {
            res.status(200).json([{ _id: 'm1', title: 'Module 1' }]);
        });

        const response = await request(app).get('/api/courses/c1/modules');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(controllerMocks.getLessonModulesByCourseController).toHaveBeenCalledTimes(1);
    });

    it('POST /api/courses/:courseId/modules returns 400 when payload is invalid', async () => {
        const response = await request(app)
            .post('/api/courses/c1/modules')
            .send({ title: 'ab', description: 'short' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(controllerMocks.createLessonModuleController).not.toHaveBeenCalled();
    });

    it('POST /api/courses/:courseId/modules forwards to createLessonModuleController', async () => {
        controllerMocks.createLessonModuleController.mockImplementation((_req, res) => {
            res.status(201).json({ _id: 'm1', title: 'Giới thiệu Node.js' });
        });

        const response = await request(app)
            .post('/api/courses/c1/modules')
            .send({
                title: 'Giới thiệu Node.js',
                description: 'Mô tả chương học đủ dài',
            });

        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe('Giới thiệu Node.js');
        expect(controllerMocks.createLessonModuleController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/courses/:courseId/modules/:moduleId forwards to getLessonModuleByIdController', async () => {
        controllerMocks.getLessonModuleByIdController.mockImplementation((_req, res) => {
            res.status(200).json({ _id: 'm1', title: 'Module 1' });
        });

        const response = await request(app).get('/api/courses/c1/modules/m1');

        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe('m1');
        expect(controllerMocks.getLessonModuleByIdController).toHaveBeenCalledTimes(1);
    });
});
