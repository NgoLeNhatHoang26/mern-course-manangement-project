import bcrypt from 'bcryptjs';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.js';
import { sendResetPasswordEmail } from '../config/mailer.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export const registerUser = async (userData: RegisterInput) => {
    const exist = await User.findOne({ email: userData.email });
    if (exist) {
        throw new AppError('Email already exists', 409);
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
        userName: userData.userName,
        email: userData.email,
        password: hashPassword,
        role: 'user',
    });

    return { message: 'Register successfully' };
};

export const loginUser = async (loginData: LoginInput) => {
    const user = await User.findOne({ email: loginData.email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    if (user.isActive === false) {
        throw new AppError('Account is deactivated', 403);
    }

    const secret = env.JWT_SECRET;
    const refreshSecret = env.JWT_REFRESH_SECRET;

    const expiresIn = env.JWT_EXPIRES as SignOptions['expiresIn'];
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });

    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: '7d' });

    await User.findByIdAndUpdate(user.id, { refreshToken });

    return {
        token,
        refreshToken,
        user: {
            id: user.id,
            userName: user.userName,
            email: user.email,
            role: user.role,
        },
    };
};

export const refreshAccessToken = async (refreshToken: string) => {
    const refreshSecret = env.JWT_REFRESH_SECRET;
    let decoded: JwtPayload;

    try {
        decoded = jwt.verify(refreshToken, refreshSecret) as JwtPayload;
    } catch {
        throw new AppError('Refresh token invalid or expired', 401);
    }

    const user = await User.findById(decoded.sub).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Refresh token not recognized', 401);
    }

    if (user.isActive === false) {
        throw new AppError('Account is deactivated', 403);
    }

    const secret = env.JWT_SECRET;
    const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        secret,
        { expiresIn: '15m' },
    );

    return { accessToken };
};

export const logoutUser = async (refreshToken: string) => {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    return { message: 'Logged out successfully' };
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
};

export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        // intentional vague response to prevent user enumeration
        return { message: 'Nếu email tồn tại, bạn sẽ nhận được link reset' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await sendResetPasswordEmail(email, resetToken);

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    return { message: 'Nếu email tồn tại, bạn sẽ nhận được link reset' };
};

export const resetPassword = async (token: string, password: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
        throw new AppError('Invalid or expired token', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
    });

    return { message: 'Đặt lại mật khẩu thành công' };
};
