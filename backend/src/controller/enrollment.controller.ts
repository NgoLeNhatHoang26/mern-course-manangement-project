import {Enrollment} from '../models/enrollment.ts'

export const enrollCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.body;

        const enrollment = new Enrollment({ userId, courseId });
        const saved = await enrollment.save();
        res.status(201).json(saved);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Bạn đã đăng ký khoá học này rồi" });
        }
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách course đã enroll
export const getMyEnrollments = async (req, res) => {
    try {
        const userId = req.user._id;
        const enrollments = await Enrollment
            .find({ userId })
            .populate("courseId")
            .sort({ enrollmentAt: -1 });
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Kiểm tra đã enroll chưa
export const checkEnrollment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;
        const enrollment = await Enrollment.findOne({ userId, courseId });
        res.status(200).json({ isEnrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
