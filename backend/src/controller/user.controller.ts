import { NextFunction, Request, Response } from 'express';
import { getUserProfile, createNewAccount, updateUserProfile } from '../services/user.service.js';

export const getUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const user = await getUserProfile(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const createNewAccountController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await createNewAccount(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const updateUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const updatedUser = await updateUserProfile(userId, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};
