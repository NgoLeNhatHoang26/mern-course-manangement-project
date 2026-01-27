// routes/admin.route.js

import express from 'express'
import adminController from '../controllers/admin.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/role.middleware.js'

const router = express.Router()

router.use(authMiddleware)
router.use(isAdmin)

// USER
router.get('/users', adminController.getAllUsers)
router.get('/users/:id', adminController.getUserById)
router.put('/users/:id/role', adminController.updateUserRole)
router.put('/users/:id/block', adminController.blockUser)
router.delete('/users/:id', adminController.deleteUser)

// COURSE
router.post('/courses', adminController.createCourse)
router.put('/courses/:id', adminController.updateCourse)
router.delete('/courses/:id', adminController.deleteCourse)
router.put('/courses/:id/publish', adminController.publishCourse)

// DASHBOARD
router.get('/dashboard', adminController.getDashboard)

export default router
