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

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getUserById(req.params.id as string);
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserRoleController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const updatedUser = await updateUserRole(id as string, role);
        res.json(updatedUser);
    } catch (error) {
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
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await deleteUser(req.params.id as string);
        res.json(result);
    } catch (error) {
        next(error);
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