import { Router } from 'express'
import {  getAllUsers, getUserById,updateUserRole,createCourse,deleteCourse,} from '../controller/admin.controller.js'

const router = Router()


// USER
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.put('/users/:id/role', updateUserRole)

// COURSE
router.post('/courses', createCourse)
router.delete('/courses/:id', deleteCourse)



export default router
