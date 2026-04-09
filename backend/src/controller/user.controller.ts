import { NextFunction, Request, Response } from 'express';
import { getUserProfile, createNewAccount, updateUserProfile } from '../services/user.service.js';

export const getUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const user = await getUserProfile(userId);
        res.json(user);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        next(error);
    }
};

export const createNewAccountController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await createNewAccount(req.body);
        res.status(201).json(result);
    } catch (error) {
        if ((error as Error).message === 'Missing required fields') {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if ((error as Error).message === 'Password must be at least 6 characters') {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }
        if ((error as Error).message === 'Email already exists') {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        next(error);
    }
};

export const updateUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();
        const updatedUser = await updateUserProfile(userId, req.body);
        res.json(updatedUser);
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        next(error);
    }
};