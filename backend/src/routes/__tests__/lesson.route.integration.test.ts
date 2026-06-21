import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'admin' },
}));

const controllerMocks = vi.hoisted(() => ({
    getLessonsByModuleController: vi.fn(),
    getLessonByIdController: vi.fn(),
    createLessonController: vi.fn(),
    updateLessonController: vi.fn(),
    deleteLessonController: vi.fn(),
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = authState.user;
        next();
    },
}));

vi.mock('../../middleware/upload.js', () => ({
    handleImageUpload: (_req: any, _res: any, next: any) => next(),
    uploadImage: { single: () => (_req: any, _res: any, next: any) => next() },
    uploadVideo: { single: () => (_req: any, _res: any, next: any) => next() },
}));

vi.mock('../../controller/lesson.controller.js', () => controllerMocks);

describe('lesson.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'admin' };
    });

    it('GET /api/courses/:courseId/modules/:moduleId/lessons forwards to getLessonsByModuleController', async () => {
        controllerMocks.getLessonsByModuleController.mockImplementation((_req, res) => {
            res.status(200).json([{ _id: 'l1', title: 'Lesson 1' }]);
        });

        const response = await request(app).get('/api/courses/c1/modules/m1/lessons');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(controllerMocks.getLessonsByModuleController).toHaveBeenCalledTimes(1);
    });

    it('POST /api/courses/:courseId/modules/:moduleId/lessons returns 400 when payload is invalid', async () => {
        const response = await request(app)
            .post('/api/courses/c1/modules/m1/lessons')
            .send({ title: 'ab', content: 'short', duration: 0 });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(controllerMocks.createLessonController).not.toHaveBeenCalled();
    });

    it('POST /api/courses/:courseId/modules/:moduleId/lessons forwards to createLessonController', async () => {
        controllerMocks.createLessonController.mockImplementation((_req, res) => {
            res.status(201).json({ _id: 'l1', title: 'Bài học đầu tiên' });
        });

        const response = await request(app)
            .post('/api/courses/c1/modules/m1/lessons')
            .send({
                title: 'Bài học đầu tiên',
                content: 'Nội dung bài học đủ dài',
                duration: 10,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe('Bài học đầu tiên');
        expect(controllerMocks.createLessonController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/courses/:courseId/modules/:moduleId/lessons/:lessonId forwards to getLessonByIdController', async () => {
        controllerMocks.getLessonByIdController.mockImplementation((_req, res) => {
            res.status(200).json({ _id: 'l1', title: 'Lesson 1' });
        });

        const response = await request(app).get('/api/courses/c1/modules/m1/lessons/l1');

        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe('l1');
        expect(controllerMocks.getLessonByIdController).toHaveBeenCalledTimes(1);
    });
});
