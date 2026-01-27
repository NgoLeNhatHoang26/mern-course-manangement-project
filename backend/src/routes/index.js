import courseRoute from './courses.route.js';
import userRoute from './user.route.js';
import adminRoute from './admin.route.js';
import lessonRoute from './lesson.route.js';
import enrollmentRoute from './enrollment.route.js';
import reviewRoute from './review.route.js';


export default function router(app) {
    app.use('/api/courses', courseRoute);
    app.use('/api/user/me', userRoute)
    app.use('/api/lessons', lessonRoute)
    app.use('/api/admin', adminRoute)
    app.use('/api/enrollments', enrollmentRoute)
    app.use('/api/reviews', reviewRoute)
}
