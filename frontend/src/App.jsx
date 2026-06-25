import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ROUTES } from './constants/routes';
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const MyCoursesPage = lazy(() => import('./pages/MyCoursesPage'));
const MyProfilePage = lazy(() => import('./pages/MyProfilePage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage.jsx'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
import MainLayout from './layout/MainLayout.jsx';
import './App.css'

const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

function App() {

  return (
      <Router>
        <Suspense fallback={<PageLoading />}>
          <Routes>
              <Route element={<MainLayout />} >
                  <Route path={ROUTES.HOME} element={<HomePage />} />
                  <Route path={ROUTES.COURSE_DETAIL} element={<CoursePage />} />
                  <Route path={ROUTES.LESSON_DETAIL} element={<LessonPage />} />
                  <Route path={ROUTES.MY_COURSES} element={<MyCoursesPage />} />
                  <Route path={ROUTES.MY_PROFILE} element={<MyProfilePage />} />
                  <Route path={ROUTES.USERS} element={<UsersPage />} />
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              </Route>

              <Route path={ROUTES.COURSE_LESSON_DETAIL} element={<LessonPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
              <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Routes>
        </Suspense>
      </Router>
  );
}

export default App
