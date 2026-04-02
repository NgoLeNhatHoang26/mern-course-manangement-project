import bcrypt from 'bcryptjs';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.js';
import { sendResetPasswordEmail } from '../config/mailer.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

export const registerUser = async (userData: RegisterInput) => {
    const exist = await User.findOne({ email: userData.email });
    if (exist) {
        throw new Error('Email already exists');
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
        userName: userData.userName,
        email: userData.email,
        password: hashPassword,
        role: 'user'
    });

    return { message: 'Register successfully' };
};

export const loginUser = async (loginData: LoginInput) => {
    const user = await User.findOne({ email: loginData.email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const secret = process.env.JWT_SECRET!;
    const refreshSecret = process.env.JWT_REFRESH_SECRET!;

    const expiresIn = (process.env.JWT_EXPIRES || '15m') as SignOptions['expiresIn'];
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn });

    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: '7d' });

    await User.findByIdAndUpdate(user.id, { refreshToken });

    return {
        token,
        refreshToken,
        user: {
            id: user._id,
            name: user.userName,
            email: user.email,
            role: user.role,
        },
    };
};

export const refreshAccessToken = async (refreshToken: string) => {
    const refreshSecret = process.env.JWT_REFRESH_SECRET!;
    let decoded: JwtPayload;

    try {
        decoded = jwt.verify(refreshToken, refreshSecret) as JwtPayload;
    } catch {
        throw new Error('Refresh token invalid or expired');
    }

    const user = await User.findById(decoded.sub).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Refresh token not recognized');
    }

    const secret = process.env.JWT_SECRET!;
    const accessToken = jwt.sign(
        { sub: user.id, role: user.role },
        secret,
        { expiresIn: '15m' }
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
        throw new Error('User not found');
    }
    return user;
};

export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { message: 'Nếu email tồn tại, bạn sẽ nhận được link reset' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendResetPasswordEmail(email, resetToken);

    return { message: 'Nếu email tồn tại, bạn sẽ nhận được link reset' };
};

export const resetPassword = async (token: string, password: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
        throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
    });

    return { message: 'Đặt lại mật khẩu thành công' };
};