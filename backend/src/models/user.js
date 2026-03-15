import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
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
        select: false,
    },
    avatarUrl: {
        type: String,
        required: false,
    },
    bio:{
        type: String,
        required: false,
    },
}, { timestamps: true } );

export const User = mongoose.model("User", userSchema);
