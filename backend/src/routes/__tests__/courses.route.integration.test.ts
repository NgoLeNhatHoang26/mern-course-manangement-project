import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'admin' },
}));

const controllerMocks = vi.hoisted(() => ({
    getAllCoursesController: vi.fn(),
    getCourseByIdController: vi.fn(),
    createCourseController: vi.fn(),
    updateCourseController: vi.fn(),
    deleteCourseController: vi.fn(),
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

vi.mock('../../controller/courses.controller.js', () => controllerMocks);

describe('courses.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'admin' };
    });

    it('GET /api/courses forwards to getAllCoursesController', async () => {
        controllerMocks.getAllCoursesController.mockImplementation((_req, res) => {
            res.status(200).json({
                items: [{ _id: 'c1', title: 'Node.js' }],
                pagination: { page: 1, limit: 12, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
            });
        });

        const response = await request(app).get('/api/courses');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toHaveLength(1);
        expect(response.body.data.items[0]._id).toBe('c1');
        expect(response.body.data.pagination.total).toBe(1);
        expect(controllerMocks.getAllCoursesController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/courses forwards page and limit query to controller', async () => {
        controllerMocks.getAllCoursesController.mockImplementation((_req, res) => {
            res.status(200).json({
                items: [],
                pagination: { page: 2, limit: 12, total: 20, totalPages: 2, hasNextPage: false, hasPrevPage: true },
            });
        });

        const response = await request(app).get('/api/courses?page=2&limit=12');

        expect(response.status).toBe(200);
        expect(response.body.data.pagination.page).toBe(2);
        expect(response.body.data.pagination.hasPrevPage).toBe(true);
        expect(controllerMocks.getAllCoursesController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/courses/:courseId forwards to getCourseByIdController', async () => {
        controllerMocks.getCourseByIdController.mockImplementation((_req, res) => {
            res.status(200).json({ _id: 'c1', title: 'Node.js' });
        });

        const response = await request(app).get('/api/courses/c1');

        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe('c1');
        expect(controllerMocks.getCourseByIdController).toHaveBeenCalledTimes(1);
    });

    it('POST /api/courses returns 400 when payload is invalid', async () => {
        const response = await request(app)
            .post('/api/courses')
            .send({ title: 'ab', description: 'short' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Dữ liệu không hợp lệ');
        expect(controllerMocks.createCourseController).not.toHaveBeenCalled();
    });

    it('POST /api/courses forwards to controller when admin payload is valid', async () => {
        controllerMocks.createCourseController.mockImplementation((_req, res) => {
            res.status(201).json({ _id: 'c1', title: 'Node.js cơ bản' });
        });

        const response = await request(app)
            .post('/api/courses')
            .send({
                title: 'Node.js cơ bản',
                description: 'Mô tả khoá học đủ dài',
                level: 'Cơ bản',
                instructor: 'John Doe',
            });

        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe('Node.js cơ bản');
        expect(controllerMocks.createCourseController).toHaveBeenCalledTimes(1);
    });

    it('POST /api/courses returns 403 when user is not admin', async () => {
        authState.user = { _id: 'u2', id: 'u2', role: 'user' };

        const response = await request(app)
            .post('/api/courses')
            .send({
                title: 'Node.js cơ bản',
                description: 'Mô tả khoá học đủ dài',
                level: 'Cơ bản',
                instructor: 'John Doe',
            });

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(controllerMocks.createCourseController).not.toHaveBeenCalled();
    });
});
