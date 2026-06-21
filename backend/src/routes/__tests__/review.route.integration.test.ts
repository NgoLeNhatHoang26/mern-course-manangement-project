import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'user' },
}));

const controllerMocks = vi.hoisted(() => ({
    getAllReviewsController: vi.fn(),
    createReviewController: vi.fn(),
    updateReviewController: vi.fn(),
    deleteReviewController: vi.fn(),
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = authState.user;
        next();
    },
}));

vi.mock('../../controller/review.controller.js', () => controllerMocks);

describe('review.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'user' };
    });

    it('GET /api/courses/:courseId/reviews forwards to getAllReviewsController', async () => {
        controllerMocks.getAllReviewsController.mockImplementation((_req, res) => {
            res.status(200).json([{ _id: 'r1', rating: 5, comment: 'Great course' }]);
        });

        const response = await request(app).get('/api/courses/c1/reviews');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(controllerMocks.getAllReviewsController).toHaveBeenCalledTimes(1);
    });

    it('POST /api/courses/:courseId/reviews returns 400 when payload is invalid', async () => {
        const response = await request(app)
            .post('/api/courses/c1/reviews')
            .send({ rating: 6, comment: 'short' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Dữ liệu không hợp lệ');
        expect(controllerMocks.createReviewController).not.toHaveBeenCalled();
    });

    it('POST /api/courses/:courseId/reviews forwards to createReviewController', async () => {
        controllerMocks.createReviewController.mockImplementation((_req, res) => {
            res.status(201).json({ _id: 'r1', rating: 5, comment: 'Excellent course content' });
        });

        const response = await request(app)
            .post('/api/courses/c1/reviews')
            .send({ rating: 5, comment: 'Excellent course content' });

        expect(response.status).toBe(201);
        expect(response.body.data.rating).toBe(5);
        expect(controllerMocks.createReviewController).toHaveBeenCalledTimes(1);
    });

    it('PATCH /api/courses/:courseId/reviews/:reviewId forwards to updateReviewController', async () => {
        controllerMocks.updateReviewController.mockImplementation((_req, res) => {
            res.status(200).json({ _id: 'r1', rating: 4, comment: 'Updated review content' });
        });

        const response = await request(app)
            .patch('/api/courses/c1/reviews/r1')
            .send({ rating: 4 });

        expect(response.status).toBe(200);
        expect(response.body.data.rating).toBe(4);
        expect(controllerMocks.updateReviewController).toHaveBeenCalledTimes(1);
    });

    it('DELETE /api/courses/:courseId/reviews/:reviewId forwards to deleteReviewController', async () => {
        controllerMocks.deleteReviewController.mockImplementation((_req, res) => {
            res.status(200).json({ message: 'Review deleted successfully' });
        });

        const response = await request(app).delete('/api/courses/c1/reviews/r1');

        expect(response.status).toBe(200);
        expect(response.body.data.message).toBe('Review deleted successfully');
        expect(controllerMocks.deleteReviewController).toHaveBeenCalledTimes(1);
    });
});
