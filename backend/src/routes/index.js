import courseRoute from './courses.route.js';
import userRoute from './user.route.js';
import adminRoute from './admin.route.js';
import lessonRoute from './lesson.route.js';
import enrollmentRoute from './enrollment.route.js';
import reviewRoute from './review.route.js';


export default function router(app) {
    app.use('/courses', courseRoute)
    app.use('/user/me', userRoute)
    app.use('/lessons', lessonRoute)
    app.use('/lessonModules', lessonRoute)
    app.use('/admin', adminRoute)
    app.use('/enrollments', enrollmentRoute)
    app.use('/reviews', reviewRoute)
}
