import { Router } from 'express'
import { getUserProfile, updateUserProfile, createNewAccount } from '../controller/user.controller.js'
import enrollmentRoute from './enrollment.route.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = Router()

// Public
router.post('/', createNewAccount)

// User đã đăng nhập
router.get('/', authMiddleware, getUserProfile)
router.patch('/', authMiddleware, updateUserProfile)
router.use('/enrollments', authMiddleware, enrollmentRoute)

export default router