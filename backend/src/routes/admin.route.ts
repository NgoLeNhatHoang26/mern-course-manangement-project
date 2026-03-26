import { Router } from 'express'
import {  getAllUsers, getUserById,updateUserProfile, deleteUser, getDashboard} from '../controller/admin.controller.js'
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
