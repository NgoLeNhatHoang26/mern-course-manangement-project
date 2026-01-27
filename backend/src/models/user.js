import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // ⚠️ Không tự động trả về khi query (bảo mật)
    },
    avatarUrl: {
        type: String,
        required: true,
    },
    bio:{
        type: String,
        required: false,
    },
}, { timestamps: true } );

export const User = mongoose.model("User", userSchema);
