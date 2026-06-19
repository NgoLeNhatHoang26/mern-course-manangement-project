import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

vi.mock('../../models/user.js', () => ({
    User: {
        findById: vi.fn(),
    },
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        verify: vi.fn(),
    },
}));

import { User } from '../../models/user.js';
import authMiddleware from '../auth.middleware.js';

describe('auth.middleware unit', () => {
    const mockStatus = vi.fn();
    const mockJson = vi.fn();
    const mockNext = vi.fn() as NextFunction;

    const mockRes = {
        status: mockStatus,
        json: mockJson,
    } as unknown as Response;

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test-jwt-secret';
        mockStatus.mockReturnValue(mockRes);
    });

    it('should return 401 when authorization header is missing', async () => {
        const mockReq = {
            headers: {},
        } as Request;

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 500 when JWT_SECRET is not configured', async () => {
        delete process.env.JWT_SECRET;
        const mockReq = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        } as Request;

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ message: 'JWT_SECRET not configured' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is expired', async () => {
        const mockReq = {
            headers: {
                authorization: 'Bearer expired-token',
            },
        } as Request;

        vi.mocked((jwt as any).verify).mockImplementation(() => {
            const error = new Error('jwt expired') as any;
            error.name = 'TokenExpiredError';
            throw error;
        });

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized: Token expired' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
        const mockReq = {
            headers: {
                authorization: 'Bearer invalid-token',
            },
        } as Request;

        vi.mocked((jwt as any).verify).mockImplementation(() => {
            throw new Error('jwt malformed');
        });

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized: Token invalid or malformed' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user does not exist', async () => {
        const mockReq = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        } as Request;

        vi.mocked((jwt as any).verify).mockReturnValue({ sub: 'user-id-1' });
        vi.mocked(User.findById).mockResolvedValue(null as any);

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(User.findById).toHaveBeenCalledWith('user-id-1');
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized: User not found' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should attach user to request and call next when token is valid', async () => {
        const userId = new mongoose.Types.ObjectId();
        const mockReq = {
            headers: {
                authorization: 'Bearer valid-token',
            },
        } as Request;

        vi.mocked((jwt as any).verify).mockReturnValue({ sub: userId.toString() });
        vi.mocked(User.findById).mockResolvedValue({
            _id: userId.toString(),
            id: 'user-id-1',
            role: 'user',
        } as any);

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(User.findById).toHaveBeenCalledWith(userId.toString());
        expect((mockReq as any).user).toEqual({
            _id: expect.any(mongoose.Types.ObjectId),
            id: 'user-id-1',
            role: 'user',
        });
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockStatus).not.toHaveBeenCalled();
        expect(mockJson).not.toHaveBeenCalled();
    });
});
