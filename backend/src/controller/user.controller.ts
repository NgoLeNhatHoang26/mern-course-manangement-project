import { User } from "../models/user.ts";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
export const getUserProfile = async (req, res) => {
    try {
        const user = await User
            .findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
export const createNewAccount = async (req, res) => {
    try {
        const { email, password, userName } = req.body;

        // 1. Validate input
        if (!email || !password || !userName) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // 2. Check email tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        // 3. Hash password 🔥
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo user mới
        const newUser = await User.create({
            email,
            password: hashedPassword,
            userName,
        });

        // 5. Tạo token (optional nhưng nên có)
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Trả về response (KHÔNG trả password)
        const { password: _, ...userData } = newUser._doc;

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: userData,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}