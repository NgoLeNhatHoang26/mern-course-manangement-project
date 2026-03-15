import {LessonModule}from '../models/lessonModule.js';

export const getLessonModulesByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const lessonModules = await LessonModule.find({courseId: courseId}).sort({order: 1});
        res.json(lessonModules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getLessonModuleById = async (req, res) => {
    try {
        const lessonModule = await LessonModule.findById(req.params.moduleId);
        if (!lessonModule) {
            return res.status(404).json({ message: "Lesson module not found" });
        }
        res.json(lessonModule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createLessonModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const lastModule = await LessonModule
            .findOne({ courseId })
            .sort({ order: -1 });

        const newOrder = lastModule ? lastModule.order + 1 : 1;
        const newLessonModule = new LessonModule({
            ...req.body,
            courseId: courseId,
            order: newOrder,
        });

        const savedLessonModule = await newLessonModule.save();
        res.status(201).json(savedLessonModule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateLessonModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const updatedModule = await LessonModule.findByIdAndUpdate(
            moduleId,
            req.body,
            { new: true } // trả về document sau khi update
        );
        if (!updatedModule) {
            return res.status(404).json({
                message: "Lesson module not found"
            });
        }
        res.json(updatedModule);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const deleteLessonModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const deletedModule = await LessonModule.findByIdAndDelete(moduleId);
        if (!deletedModule) {
            return res.status(404).json({
                message: "Lesson module not found"
            });
        }
        res.json({
            message: "Lesson module deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}