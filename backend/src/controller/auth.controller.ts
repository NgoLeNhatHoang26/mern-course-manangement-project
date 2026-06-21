import { Request, Response, NextFunction } from 'express';
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUserById,
    forgotPassword,
    resetPassword,
} from '../services/auth.service.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await registerUser(req.body as RegisterInput);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, refreshToken, user } = await loginUser(req.body as LoginInput);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }
        const user = await getUserById(req.user._id as unknown as string);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return next(new AppError('No refresh token', 401));
        }

        const { accessToken } = await refreshAccessToken(token);
        res.status(200).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            await logoutUser(token);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const forgotPasswordController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;
        const result = await forgotPassword(email);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const resetPasswordController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, password } = req.body;
        const result = await resetPassword(token, password);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login,
    refresh,
    logout,
    getMe,
    forgotPassword: forgotPasswordController,
    resetPassword: resetPasswordController,
};
