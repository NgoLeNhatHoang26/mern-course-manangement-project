import { Lesson } from '../models/lesson.js'

export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) {
            return res.status(404).json({message: 'Lessson is not found'});
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getLessonsByModule = async (req, res) => {
    try {
        const id = req.params.moduleId;
        const lessons = await Lesson.find({moduleId : id}).sort({ order: 1 });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createLesson = async (req, res) => {
    try {
        const {moduleId} = req.params;
        const lastLesson = await Lesson
            .findOne({moduleId})
            .sort({ order: -1 });
        const newOrder = lastLesson? lastLesson.order + 1 : 1;
        const newLesson = new Lesson({
            ...req.body,
            moduleId,
            order: newOrder,
        });
        const savedLesson = await newLesson.save();
        res.status(201).json(savedLesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            req.body,
            { new: true }
        );
        if (!updatedLesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }
        res.json(updatedLesson);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

}
export const deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const updatedLesson = await Lesson.findByIdAndUpdate(
            lessonId,
            req.body,
            { new: true }
        );
        if (!updatedLesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }
        res.json(updatedLesson);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

