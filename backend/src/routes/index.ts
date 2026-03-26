import courseRoute from './courses.route.js';
import userRoute from './user.route.js';
import adminRoute from './admin.route.js';
import lessonRoute from './lesson.route.js';
import enrollmentRoute from './enrollment.route.js';
import moduleRoute from './lessonModule.route.js';
import authRoute from './auth.route.js';
export default function router(app: any) {

    app.use('/api/courses', courseRoute)
    app.use('/api/users', userRoute)
    app.use('/api/lessons', lessonRoute)
    app.use('/api/modules', moduleRoute)
    app.use('/api/admin', adminRoute)
    app.use('/api/enrollments', enrollmentRoute)
    app.use('/api/auth', authRoute)
}
