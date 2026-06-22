import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import { User } from '../models/user.js';
import { Course } from '../models/course.js';
import { LessonModule } from '../models/lessonModule.js';
import { Lesson } from '../models/lesson.js';
import { Enrollment } from '../models/enrollment.js';
import { Review } from '../models/review.js';

const DEFAULT_PASSWORD = 'Password123!';

const clearDatabase = async (): Promise<void> => {
    await Review.deleteMany({});
    await Enrollment.deleteMany({});
    await Lesson.deleteMany({});
    await LessonModule.deleteMany({});
    await Course.deleteMany({});
    await User.deleteMany({});
};

const seed = async (): Promise<void> => {
    await connectDB();

    console.log('Clearing existing data...');
    await clearDatabase();

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    const [admin, student1, student2] = await User.create([
        {
            userName: 'Admin',
            email: 'admin@example.com',
            password: passwordHash,
            role: 'admin',
            bio: 'Quản trị viên hệ thống',
        },
        {
            userName: 'Nguyen Van A',
            email: 'student1@example.com',
            password: passwordHash,
            role: 'user',
            bio: 'Học viên yêu thích lập trình web',
        },
        {
            userName: 'Tran Thi B',
            email: 'student2@example.com',
            password: passwordHash,
            role: 'user',
            bio: 'Đang học React và Node.js',
        },
    ]);

    const [nodeCourse, reactCourse] = await Course.create([
        {
            title: 'Node.js cho người mới bắt đầu',
            description:
                'Khóa học giới thiệu Node.js, Express, REST API và làm việc với MongoDB. Phù hợp người mới bắt đầu backend.',
            level: 'Cơ bản',
            instructor: 'Nguyen Minh Duc',
        },
        {
            title: 'React nâng cao',
            description:
                'Đi sâu vào hooks, state management, performance và các pattern xây dựng ứng dụng React quy mô lớn.',
            level: 'Nâng cao',
            instructor: 'Le Hoang Nam',
        },
    ]);

    const [nodeModule1, nodeModule2] = await LessonModule.create([
        {
            courseId: nodeCourse._id,
            title: 'Giới thiệu Node.js',
            description: 'Tổng quan về Node.js và hệ sinh thái npm',
            order: 1,
        },
        {
            courseId: nodeCourse._id,
            title: 'Xây dựng REST API',
            description: 'Tạo API với Express và kết nối MongoDB',
            order: 2,
        },
    ]);

    const [reactModule1] = await LessonModule.create([
        {
            courseId: reactCourse._id,
            title: 'Hooks nâng cao',
            description: 'useReducer, useCallback, useMemo và custom hooks',
            order: 1,
        },
    ]);

    await Lesson.create([
        {
            courseId: nodeCourse._id,
            moduleId: nodeModule1._id,
            title: 'Node.js là gì?',
            content: 'Giới thiệu runtime V8, event loop và ứng dụng thực tế của Node.js.',
            duration: 12,
            order: 1,
            isPreview: true,
        },
        {
            courseId: nodeCourse._id,
            moduleId: nodeModule1._id,
            title: 'Cài đặt môi trường',
            content: 'Cài Node.js, npm và khởi tạo project đầu tiên.',
            duration: 10,
            order: 2,
        },
        {
            courseId: nodeCourse._id,
            moduleId: nodeModule2._id,
            title: 'Routing với Express',
            content: 'Định nghĩa routes, middleware và xử lý lỗi cơ bản.',
            duration: 18,
            order: 1,
        },
        {
            courseId: nodeCourse._id,
            moduleId: nodeModule2._id,
            title: 'Kết nối MongoDB',
            content: 'Sử dụng Mongoose để modeling và truy vấn dữ liệu.',
            duration: 22,
            order: 2,
        },
        {
            courseId: reactCourse._id,
            moduleId: reactModule1._id,
            title: 'Custom hooks',
            content: 'Tách logic tái sử dụng bằng custom hooks.',
            duration: 25,
            order: 1,
            isPreview: true,
        },
        {
            courseId: reactCourse._id,
            moduleId: reactModule1._id,
            title: 'Tối ưu render',
            content: 'React.memo, useMemo và useCallback trong thực tế.',
            duration: 20,
            order: 2,
        },
    ]);

    await Enrollment.create([
        { userId: student1._id, courseId: nodeCourse._id, progress: 25, completedLessons: 1 },
        { userId: student2._id, courseId: nodeCourse._id, progress: 50, completedLessons: 2 },
        { userId: student2._id, courseId: reactCourse._id, progress: 10, completedLessons: 0 },
    ]);

    await Review.create([
        {
            userId: student1._id,
            courseId: nodeCourse._id,
            rating: 5,
            comment: 'Giảng dạy dễ hiểu, ví dụ thực tế rất hữu ích.',
        },
        {
            userId: student2._id,
            courseId: nodeCourse._id,
            rating: 4,
            comment: 'Nội dung tốt, mong có thêm bài tập thực hành.',
        },
        {
            userId: student2._id,
            courseId: reactCourse._id,
            rating: 5,
            comment: 'Phần hooks nâng cao rất chi tiết và dễ áp dụng.',
        },
    ]);

    const updatedNodeCourse = await Course.findById(nodeCourse._id).lean();
    const updatedReactCourse = await Course.findById(reactCourse._id).lean();

    console.log('\nSeed completed successfully.\n');
    console.log('Accounts (password for all):', DEFAULT_PASSWORD);
    console.log('  Admin   -> admin@example.com');
    console.log('  Student -> student1@example.com');
    console.log('  Student -> student2@example.com');
    console.log('\nCourses:');
    console.log(`  - ${nodeCourse.title} (${updatedNodeCourse?.studentCount} students, rating ${updatedNodeCourse?.ratingAverage})`);
    console.log(`  - ${reactCourse.title} (${updatedReactCourse?.studentCount} students, rating ${updatedReactCourse?.ratingAverage})`);
    console.log(`\nCreated by: ${admin.userName} (${admin.email})\n`);

    await mongoose.disconnect();
};

seed().catch(async (error) => {
    console.error('Seed failed:', error);
    await mongoose.disconnect().catch(() => undefined);
    process.exit(1);
});
