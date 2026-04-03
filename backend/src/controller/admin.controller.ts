import { Request, Response, NextFunction } from 'express';
import { getAllUsers, getUserById, updateUserRole, toggleUserStatus, deleteUser, getDashboard } from '../services/admin.service.js';

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await getUserById(req.params.id as string);
        res.json(user);
    } catch (error) {
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(400).json({ message: 'Invalid user ID' });
    }
};

export const updateUserRoleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await updateUserRole(id as string, role);
        res.json(updatedUser);
    } catch (error) {
        if ((error as Error).message === 'Role không hợp lệ') {
            res.status(400).json({ message: 'Role không hợp lệ' });
            return;
        }
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        next(error);
    }
};

export const toggleUserStatusController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?.id || '';
        const updatedUser = await toggleUserStatus(id as string, currentUserId);
        res.json(updatedUser);
    } catch (error) {
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if ((error as Error).message === 'Không thể khóa tài khoản của chính mình') {
            res.status(400).json({ message: 'Không thể khóa tài khoản của chính mình' });
            return;
        }
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await deleteUser(req.params.id as string);
        res.json(result);
    } catch (error) {
        if ((error as Error).message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getDashboardController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await getDashboard();
        res.json(data);
    } catch (error) {
        next(error);
    }
};