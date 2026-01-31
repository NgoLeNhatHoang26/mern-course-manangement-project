import { Lesson } from '../models/lesson.js'

export const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createLesson = async (req, res) => {
    try {
        const newLesson = new Lesson(req.body);
        const savedLesson = await newLesson.save();
        res.status(201).json(savedLesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}