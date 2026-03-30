import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
    _id: string
    userName: string
    email: string
    password: string
    avatarUrl?: string
    role: string
    bio?: string
    refreshToken?: string
    createdAt: Date
    updatedAt: Date
    isActive: Boolean
}

const userSchema = new Schema<IUser>(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true, select: false },
        role: { type: String},
        avatarUrl: { type: String, required: false },
        bio: { type: String, required: false },
        refreshToken: {
            type: String,
            select: false,  // không trả về mặc định
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const User = mongoose.model<IUser>('User', userSchema)