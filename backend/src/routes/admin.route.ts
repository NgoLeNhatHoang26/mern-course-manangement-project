import { Router } from 'express'
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getDashboard,
    toggleUserStatus
} from '../controller/admin.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
import roleMiddleware from '../middleware/role.middleware.js'

const router = Router()


// USER
router.get(
    '/users', 
    authMiddleware, 
    roleMiddleware('admin'), 
    getAllUsers)

router.get(
    '/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    getUserById)

router.patch('/users/:id/role',
    authMiddleware,
    roleMiddleware('admin'),
    updateUserRole)

router.patch('/users/:id/toggle-status',
    authMiddleware,
    roleMiddleware('admin'),
    toggleUserStatus)

router.delete('/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    deleteUser)

router.get(
    '/dashboard',
    authMiddleware,
    roleMiddleware('admin'),
    getDashboard)

export default router
