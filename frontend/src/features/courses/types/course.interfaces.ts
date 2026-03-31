export interface ICourse {
    _id: string
    title: string
    description: string
    level: string
    instructor: string
    thumbnail?: string
    createdAt: string
    updatedAt: string
}

export interface ILessonModule{
    _id: string
    courseId:    string;
    title:       string;
    description: string;
    order:       number;
}