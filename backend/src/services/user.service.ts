import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const getUserProfile = async (userId: string | undefined) => {
    if (!userId) throw new AppError('Unauthorized', 401);
    const user = await User.findById(userId).select('-password');
    if (!user) throw new AppError('User not found', 404);
    return user;
};

export const createNewAccount = async (userData: { email: string; password: string; userName: string }) => {
    const { email, password, userName } = userData;

    if (!email || !password || !userName) {
        throw new AppError('Missing required fields', 400);
    }

    if (password.length < 6) {
        throw new AppError('Password must be at least 6 characters', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        userName,
    });

    const secret = env.JWT_SECRET;
    const token = jwt.sign({ sub: newUser._id.toString(), role: newUser.role ?? 'user' }, secret, { expiresIn: '7d' });

    const { password: _, ...userDataResponse } = newUser.toObject();

    return {
        message: 'User created successfully',
        token,
        user: userDataResponse,
    };
};

export const updateUserProfile = async (userId: string | undefined, updateData: Record<string, unknown>) => {
    if (!userId) throw new AppError('Unauthorized', 401);

    // Only allow safe fields to be updated to prevent mass assignment
    const { userName, avatar } = updateData as { userName?: string; avatar?: string };
    const safeUpdate: Record<string, unknown> = {};
    if (userName !== undefined) safeUpdate.userName = userName;
    if (avatar !== undefined) safeUpdate.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        safeUpdate,
        { new: true, runValidators: true },
    ).select('-password');

    if (!updatedUser) throw new AppError('User not found', 404);
    return updatedUser;
};
