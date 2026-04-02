import { Router } from 'express';
import {
    getAllUsersController,
    getUserByIdController,
    updateUserRoleController,
    deleteUserController,
    getDashboardController,
    toggleUserStatusController
} from '../controller/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const router = Router();

// USER
router.get(
    '/users',
    authMiddleware,
    roleMiddleware('admin'),
    getAllUsersController);

router.get(
    '/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    getUserByIdController);

router.patch('/users/:id/role',
    authMiddleware,
    roleMiddleware('admin'),
    updateUserRoleController);

router.patch('/users/:id/toggle-status',
    authMiddleware,
    roleMiddleware('admin'),
    toggleUserStatusController);

router.delete('/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    deleteUserController);

router.get(
    '/dashboard',
    authMiddleware,
    roleMiddleware('admin'),
    getDashboardController);

export default router;
