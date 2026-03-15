import { User } from "../models/user.js";

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