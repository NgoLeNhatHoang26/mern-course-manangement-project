import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/user.js', () => ({
    User: {
        findOne: vi.fn(),
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        create: vi.fn(),
        findOneAndUpdate: vi.fn(),
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn(),
    },
}));

vi.mock('../../config/mailer.js', () => ({
    sendResetPasswordEmail: vi.fn(),
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.js';
import { sendResetPasswordEmail } from '../../config/mailer.js';
import { AppError } from '../../utils/AppError.js';

import { registerUser, loginUser, refreshAccessToken, resetPassword, forgotPassword } from '../auth.service.js';

describe ('auth.service. unit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test-jwt-secret';
        process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
        process.env.JWT_EXPIRES = '15m';
    });

    describe('registerUser', () => {
        it('should throw when email already exists', async () => {
            vi.mocked(User.findOne).mockResolvedValue({ email: 'test@example.com' } as any);
            
            await expect(
                registerUser({
                    userName: 'testuser',
                    email: 'test@example.com',
                    password: 'testpassword',
                    confirmPassword: 'testpassword',
                }) as any
            ).rejects.toThrow('Email already exists');
            // Kiểm tra xem hàm create có được gọi không
            expect(User.create).not.toHaveBeenCalled();
        });
        it('should hash password and create', async () => {
            vi.mocked(User.findOne).mockResolvedValue(null as any);
            vi.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as any);

            const result = await registerUser({
                userName: 'testuser',
                email: 'test@example.com',
                password: 'testpassword',
                confirmPassword: 'testpassword',
            } as any);
        
            expect((bcrypt as any).hash).toHaveBeenCalledWith('testpassword', 10);
            expect(User.create).toHaveBeenCalledWith({
                userName: 'testuser',
                email: 'test@example.com',
                password: 'hashed-password',
                role: 'user',
            });
            expect(result).toEqual({ message: 'Register successfully' });
        });
    });

    describe('loginUser', () => {
        it('should throw when user not found', async () => {
            vi.mocked(User.findOne).mockReturnValue({  
                select: vi.fn().mockResolvedValue(null)
            } as any);
            await expect(
                loginUser({
                    email: 'test@example.com',
                    password: 'testpassword',
                }) as any
            ).rejects.toThrow('Invalid email or password');
            expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('should throw when password is invalid', async () => {
            const fakeUser = {
                id: 'u1',
                password: 'hashed-password',
                role: 'user',
            } as any;

            vi.mocked(User.findOne).mockReturnValue({
                select: vi.fn().mockResolvedValue(fakeUser)
            } as any);
            vi.mocked((bcrypt as any).compare).mockResolvedValue(false);

            await expect(
                loginUser({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                } as any)
            ).rejects.toThrow('Invalid email or password');
        });

        it('should throw when account is deactivated', async () => {
            const fakeUser = {
                id: 'u1',
                password: 'hashed-password',
                role: 'user',
                isActive: false,
            } as any;

            vi.mocked(User.findOne).mockReturnValue({
                select: vi.fn().mockResolvedValue(fakeUser),
            } as any);
            vi.mocked((bcrypt as any).compare).mockResolvedValue(true);

            await expect(
                loginUser({
                    email: 'test@example.com',
                    password: 'testpassword',
                } as any),
            ).rejects.toMatchObject({
                message: 'Account is deactivated',
                statusCode: 403,
            });
            expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('should return token and refresh token when login successfully', async () => {
            const fakeUser = {
                _id: 'mongo-id',
                id: 'u1',
                userName: 'testuser',
                email: 'test@example.com',
                password: 'hashed-password',
                role: 'user',
                isActive: true,
            }
            vi.mocked(User.findOne).mockReturnValue({
                select: vi.fn().mockResolvedValue(fakeUser)
            } as any);
            vi.mocked((bcrypt as any).compare).mockResolvedValue(true);
            vi.mocked((jwt as any).sign)
                // mockReturnValueOnce thay vì mockReturnValue để mock 2 lần sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');
            
            const result = await loginUser({
                email: 'test@example.com',
                password: 'testpassword',
            } as any);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', { refreshToken: 'refresh-token' });
            expect(result).toMatchObject({
                token: 'access-token',
                refreshToken: 'refresh-token',
                user: {
                    id: 'u1',
                    userName: 'testuser',
                    email: 'test@example.com',
                    role: 'user',
                },
            })
        });
    });

    describe('refreshAccessToken', () => {
        it('should throw when account is deactivated', async () => {
            vi.mocked((jwt as any).verify).mockReturnValue({ sub: 'u1' });
            vi.mocked(User.findById).mockReturnValue({
                select: vi.fn().mockResolvedValue({
                    id: 'u1',
                    role: 'user',
                    refreshToken: 'valid-refresh',
                    isActive: false,
                }),
            } as any);

            await expect(refreshAccessToken('valid-refresh')).rejects.toMatchObject({
                message: 'Account is deactivated',
                statusCode: 403,
            });
            expect((jwt as any).sign).not.toHaveBeenCalled();
        });
    });

    describe('forgotPassword', () => {
        it('returns generic message when email is not found', async () => {
            vi.mocked(User.findOne).mockResolvedValue(null as any);

            const result = await forgotPassword('missing@example.com');

            expect(result).toEqual({ message: 'Nếu email tồn tại, bạn sẽ nhận được link reset' });
            expect(sendResetPasswordEmail).not.toHaveBeenCalled();
            expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it('saves reset token before sending email', async () => {
            const user = { _id: 'u1', email: 'test@example.com' } as any;
            vi.mocked(User.findOne).mockResolvedValue(user);
            vi.mocked(sendResetPasswordEmail).mockResolvedValue(undefined);

            const result = await forgotPassword('test@example.com');

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith('u1', {
                resetPasswordToken: expect.any(String),
                resetPasswordExpires: expect.any(Date),
            });
            expect(sendResetPasswordEmail).toHaveBeenCalledWith('test@example.com', expect.any(String));
            expect(result).toEqual({ message: 'Nếu email tồn tại, bạn sẽ nhận được link reset' });
        });

        it('does not send email when saving reset token fails', async () => {
            const user = { _id: 'u1', email: 'test@example.com' } as any;
            vi.mocked(User.findOne).mockResolvedValue(user);
            vi.mocked(User.findByIdAndUpdate).mockRejectedValue(new Error('DB error'));

            await expect(forgotPassword('test@example.com')).rejects.toThrow('DB error');
            expect(sendResetPasswordEmail).not.toHaveBeenCalled();
        });

        it('throws when email sending fails after token is saved', async () => {
            const user = { _id: 'u1', email: 'test@example.com' } as any;
            vi.mocked(User.findOne).mockResolvedValue(user);
            vi.mocked(User.findByIdAndUpdate).mockResolvedValue(user);
            vi.mocked(sendResetPasswordEmail).mockRejectedValue(
                new AppError('Unable to send reset password email. Please try again later.', 503),
            );

            await expect(forgotPassword('test@example.com')).rejects.toMatchObject({
                message: 'Unable to send reset password email. Please try again later.',
                statusCode: 503,
            });
            expect(User.findByIdAndUpdate).toHaveBeenCalled();
        });
    });
})