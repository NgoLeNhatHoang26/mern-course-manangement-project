export const ROUTES = {
  HOME: '/',
  COURSE_DETAIL: '/courses/:id',
  LESSON_DETAIL: '/lessons/:id',
  COURSE_LESSON_DETAIL: '/courses/:courseId/lessons/:lessonId',
  MY_COURSES: '/my-courses',
  MY_PROFILE: '/my-profile',
  SETTINGS: '/settings',
  USERS: '/users',
  DASHBOARD: '/dashboard',
  SIGNUP: '/signup',
  SIGNIN: '/signin',
  RESET_PASSWORD: '/reset-password',
} as const;
