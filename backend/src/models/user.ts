import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IUser extends Document {
    _id: Types.ObjectId
    userName: string
    email: string
    password: string
    avatarUrl?: string
    role: string
    bio?: string
    refreshToken?: string
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    resetPasswordToken?: string
    resetPasswordExpires?: Date
}

const userSchema = new Schema<IUser>(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, default: 'user' },
        avatarUrl: { type: String, required: false },
        bio: { type: String, required: false },
        refreshToken: {
            type: String,
            select: false,
        },
        isActive: { type: Boolean, default: true },
        resetPasswordToken:   { type: String, select: false },
        resetPasswordExpires: { type: Date, select: false },
    },
    { timestamps: true }
)

userSchema.index(
    { refreshToken: 1 },
    {
        unique: true,
        partialFilterExpression: {
            refreshToken: { $exists: true, $type: 'string', $ne: '' },
        },
    }
)

userSchema.index(
    { resetPasswordToken: 1, resetPasswordExpires: 1 },
    { partialFilterExpression: { resetPasswordToken: { $exists: true, $type: 'string' } } }
)

export const User = mongoose.model<IUser>('User', userSchema)