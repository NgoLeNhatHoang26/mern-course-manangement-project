import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const getUserProfile = async (userId: string | undefined) => {
    if (!userId) throw new Error('Unauthorized');
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

export const createNewAccount = async (userData: { email: string; password: string; userName: string }) => {
    const { email, password, userName } = userData;

    if (!email || !password || !userName) {
        throw new Error('Missing required fields');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        email,
        password: hashedPassword,
        userName,
    });

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '7d' });

    const { password: _, ...userDataResponse } = newUser.toObject();

    return {
        message: 'User created successfully',
        token,
        user: userDataResponse,
    };
};

export const updateUserProfile = async (userId: string | undefined, updateData: any) => {
    if (!userId) throw new Error('Unauthorized');
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
};