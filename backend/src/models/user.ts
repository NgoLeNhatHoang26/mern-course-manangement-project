import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
    userName: string
    email: string
    password: string
    avatarUrl?: string
    role: string
    bio?: string
    refreshToken?: string
    createdAt: Date
    updatedAt: Date
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
    },
    { timestamps: true }
)

export const User = mongoose.model<IUser>('User', userSchema)