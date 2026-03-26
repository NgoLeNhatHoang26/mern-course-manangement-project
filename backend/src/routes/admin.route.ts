import { Router } from 'express'
import {  getAllUsers, getUserById,updateUserProfile, deleteUser, getDashboard} from '../controller/admin.controller.js'
import authMiddleware from '../middleware/auth.middleware.ts'
import roleMiddleware from '../middleware/role.middleware.ts'

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

router.patch('/users/:id',
    authMiddleware,
    roleMiddleware('admin'),
    updateUserProfile)

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
