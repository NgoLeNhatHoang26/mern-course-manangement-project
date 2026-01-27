// controllers/auth.controller.js

import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const exist = await User.findOne({ email })
    if (exist) {
      return res.status(400).json({
        message: 'Email already exists'
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: 'user'
    })

    res.status(201).json({
      message: 'Register successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMe = async (req, res) => {
  res.status(200).json(req.user)
}

export default {
  register,
  login,
  getMe
}
