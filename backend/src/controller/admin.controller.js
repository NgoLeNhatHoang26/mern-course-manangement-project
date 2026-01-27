// controllers/admin.controller.js

import User from '../models/user.js'
import Course from '../models/courses.js'

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password')
  res.json(users)
}
const blockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: true
  })
  res.json({ message: 'User blocked' })
}

const updateUserRole = async (req, res) => {
  const { role } = req.body
  await User.findByIdAndUpdate(req.params.id, { role })
  res.json({ message: 'Role updated' })
}

const createCourse = async (req, res) => {
  const course = await Course.create(req.body)
  res.status(201).json(course)
}

const deleteCourse = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id)
  res.json({ message: 'Course deleted' })
}

const getDashboard = async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalCourses = await Course.countDocuments()

  res.json({
    totalUsers,
    totalCourses
  })
}

export default {
  getAllUsers,
  blockUser,
  updateUserRole,
  createCourse,
  deleteCourse,
  getDashboard
}
