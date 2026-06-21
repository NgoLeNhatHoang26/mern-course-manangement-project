import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'user' },
}));

const controllerMocks = vi.hoisted(() => ({
    getUserProfileController: vi.fn(),
    updateUserProfileController: vi.fn(),
    createNewAccountController: vi.fn(),
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = authState.user;
        next();
    },
}));

vi.mock('../../controller/user.controller.js', () => controllerMocks);

describe('user.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'user' };
    });

    it('POST /api/users forwards to createNewAccountController', async () => {
        controllerMocks.createNewAccountController.mockImplementation((_req, res) => {
            res.status(201).json({ id: 'u2', email: 'new@example.com' });
        });

        const response = await request(app)
            .post('/api/users')
            .send({
                userName: 'new-user',
                email: 'new@example.com',
                password: '123456',
            });

        expect(response.status).toBe(201);
        expect(response.body.data.email).toBe('new@example.com');
        expect(controllerMocks.createNewAccountController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/users forwards to getUserProfileController', async () => {
        controllerMocks.getUserProfileController.mockImplementation((_req, res) => {
            res.status(200).json({ id: 'u1', email: 'test@example.com' });
        });

        const response = await request(app).get('/api/users');

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe('u1');
        expect(controllerMocks.getUserProfileController).toHaveBeenCalledTimes(1);
    });

    it('PATCH /api/users forwards to updateUserProfileController', async () => {
        controllerMocks.updateUserProfileController.mockImplementation((_req, res) => {
            res.status(200).json({ id: 'u1', userName: 'updated-name' });
        });

        const response = await request(app)
            .patch('/api/users')
            .send({ userName: 'updated-name' });

        expect(response.status).toBe(200);
        expect(response.body.data.userName).toBe('updated-name');
        expect(controllerMocks.updateUserProfileController).toHaveBeenCalledTimes(1);
    });
});
