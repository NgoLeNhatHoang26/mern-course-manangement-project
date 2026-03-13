import {Enrollment} from '../models/enrollment.js'

export const getUserEnrollments = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollments = await Enrollment
            .find({ userId })
            .populate("courseId")
            .sort({ createdAt: -1 });
        res.status(200).json(enrollments);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

