// controllers/auth.controller.js

import { User } from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                message: 'Request body must be JSON. Set Content-Type: application/json and send raw JSON body.',
            })
        }
        const { userName, email, password } = req.body
        if (!email || !password || !userName) {
        return res.status(400).send({
            message: "Missing required fields",
        })
    }
    const exist = await User.findOne({ email })
    if (exist) {
      return res.status(400).json({
        message: 'Email already exists'
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    await User.create({
      userName,
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
      console.log(req.body)
    const { email, password } = req.body || {}
    if(!email || !password) {
        return res.status(400).json({
            message: "Email and password required",
        })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }
    const isPasswordValid= await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password'
      })
    }
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return res.status(500).json({
        message: 'Server error: JWT_SECRET is not set in .env',
      })
    }
    const payload = {
        sub: user.id,
        role: user.role
    }
    const token = jwt.sign(
          payload,
          secret,
          { expiresIn: process.env.JWT_EXPIRES || '7d' }
      )

    res.status(200).json({
      token,
      user: {
          id: user._id,
          name: user.userName,
          email: user.email,
          role: user.role
      }
    })
  } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);
  }
}

const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);
};
export default {
  register,
  login,
  getMe
}
