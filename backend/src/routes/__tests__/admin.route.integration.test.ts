import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

const authState = vi.hoisted(() => ({
    user: { _id: 'u1', id: 'u1', role: 'admin' },
}));

const controllerMocks = vi.hoisted(() => ({
    getAllUsersController: vi.fn(),
    getUserByIdController: vi.fn(),
    updateUserRoleController: vi.fn(),
    toggleUserStatusController: vi.fn(),
    deleteUserController: vi.fn(),
    getDashboardController: vi.fn(),
}));

vi.mock('../../middleware/auth.middleware.js', () => ({
    default: (req: any, _res: any, next: any) => {
        req.user = authState.user;
        next();
    },
}));

vi.mock('../../controller/admin.controller.js', () => controllerMocks);

describe('admin.route integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        authState.user = { _id: 'u1', id: 'u1', role: 'admin' };
    });

    it('GET /api/admin/users forwards to getAllUsersController for admin', async () => {
        controllerMocks.getAllUsersController.mockImplementation((_req, res) => {
            res.status(200).json({
                items: [{ id: 'u1', role: 'admin' }],
                pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
            });
        });

        const response = await request(app).get('/api/admin/users');

        expect(response.status).toBe(200);
        expect(response.body.data.items).toHaveLength(1);
        expect(response.body.data.pagination.total).toBe(1);
        expect(controllerMocks.getAllUsersController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/admin/users forwards page query to controller', async () => {
        controllerMocks.getAllUsersController.mockImplementation((_req, res) => {
            res.status(200).json({
                items: [],
                pagination: { page: 2, limit: 20, total: 40, totalPages: 2, hasNextPage: false, hasPrevPage: true },
            });
        });

        const response = await request(app).get('/api/admin/users?page=2');

        expect(response.status).toBe(200);
        expect(response.body.data.pagination.page).toBe(2);
        expect(controllerMocks.getAllUsersController).toHaveBeenCalledTimes(1);
    });

    it('GET /api/admin/users returns 403 for non-admin user', async () => {
        authState.user = { _id: 'u2', id: 'u2', role: 'user' };

        const response = await request(app).get('/api/admin/users');

        expect(response.status).toBe(403);
        expect(response.body.success).toBe(false);
        expect(controllerMocks.getAllUsersController).not.toHaveBeenCalled();
    });

    it('GET /api/admin/dashboard forwards to getDashboardController', async () => {
        controllerMocks.getDashboardController.mockImplementation((_req, res) => {
            res.status(200).json({ totalUsers: 10, totalCourses: 5 });
        });

        const response = await request(app).get('/api/admin/dashboard');

        expect(response.status).toBe(200);
        expect(response.body.data.totalUsers).toBe(10);
        expect(controllerMocks.getDashboardController).toHaveBeenCalledTimes(1);
    });

    it('PATCH /api/admin/users/:id/role returns 400 when role is invalid', async () => {
        const response = await request(app)
            .patch('/api/admin/users/u2/role')
            .send({ role: 'superadmin' });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(controllerMocks.updateUserRoleController).not.toHaveBeenCalled();
    });

    it('PATCH /api/admin/users/:id/role forwards to updateUserRoleController', async () => {
        controllerMocks.updateUserRoleController.mockImplementation((_req, res) => {
            res.status(200).json({ id: 'u2', role: 'admin' });
        });

        const response = await request(app)
            .patch('/api/admin/users/u2/role')
            .send({ role: 'admin' });

        expect(response.status).toBe(200);
        expect(response.body.data.role).toBe('admin');
        expect(controllerMocks.updateUserRoleController).toHaveBeenCalledTimes(1);
    });
});
