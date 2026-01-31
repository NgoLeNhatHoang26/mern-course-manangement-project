import LessonModule from '../models/lessonModule.model.js';

export const getAllLessonModules = async (req, res) => {
    try {
        const lessonModules = await LessonModule.find();
        res.json(lessonModules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getLessonModuleById = async (req, res) => {
    try {
        const lessonModule = await LessonModule.findById(req.params.id);
        if (!lessonModule) {
            return res.status(404).json({ message: "Lesson module not found" });
        }
        res.json(lessonModule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}