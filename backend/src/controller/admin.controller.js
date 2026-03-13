// controllers/admin.controller.js


import {User} from '../models/user.js'

export const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password')
    res.json(users)
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: 'Invalid user ID' })
    }
}
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
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

