import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const controllerMocks = vi.hoisted(() => ({
    register: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
}));

vi.mock('../../controller/auth.controller.js', () => ({
    default: {
        register: controllerMocks.register,
        login: controllerMocks.login,
        refresh: controllerMocks.refresh,
        logout: controllerMocks.logout,
        getMe: controllerMocks.getMe,
        forgotPassword: controllerMocks.forgotPassword,
        resetPassword: controllerMocks.resetPassword,
    },
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, res: any, next: any) => {
        req.user = { _id: 'u1', role: 'user' };
        next();
    },
}));

describe('auth.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('POST /api/auth/register returns 400 when payload is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'invalid', password: '123', confirmPassword: '123' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Dữ liệu không hợp lệ');
        expect(controllerMocks.register).not.toHaveBeenCalled();
    });

    it('POST /api/auth/register forwards to controller when payload is valid', async () => {
        controllerMocks.register.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Register successfully' });
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                userName: 'test-user',
                email: 'test@example.com',
                password: '123456',
                confirmPassword: '123456',
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.message).toBe('Register successfully');
        expect(controllerMocks.register).toHaveBeenCalledTimes(1);
    });

    it('POST /api/auth/login forwards to controller with valid payload', async () => {
        controllerMocks.login.mockImplementation((req, res) => {
            res.status(200).json({
                token: 'access-token',
                user: { id: 'u1', email: 'test@example.com' },
            });
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: '123456',
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBe('access-token');
        expect(controllerMocks.login).toHaveBeenCalledTimes(1);
    });

    it('GET /api/auth/me passes through auth middleware and controller', async () => {
        controllerMocks.getMe.mockImplementation((req, res) => {
            res.status(200).json({ id: req.user._id, role: req.user.role });
        });

        const response = await request(app).get('/api/auth/me');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({ id: 'u1', role: 'user' });
        expect(controllerMocks.getMe).toHaveBeenCalledTimes(1);
    });
});
