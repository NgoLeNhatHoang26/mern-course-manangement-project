import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
const HomePage = lazy(() => import('./pages/HomePage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const MyCoursesPage = lazy(() => import('./pages/MyCoursesPage'));
const MyProfilePage = lazy(() => import('./pages/MyProfilePage'));
const SettingPage = lazy(() => import('./pages/SettingPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const SigninPage = lazy(() => import('./pages/SigninPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
import MainLayout from './components/layout/MainLayout.jsx';
import './App.css'

const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

function App() {

  return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
              <Route element={<MainLayout />} >
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses/:id" element={<CoursePage />} />
                  <Route path="/lessons/:id" element={<LessonPage />} />
                  <Route path="/my-courses" element={<MyCoursesPage />} />
                  <Route path="/my-profile" element={<MyProfilePage />} />
                  <Route path="/settings" element={<SettingPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
              </Route>

              <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Suspense>
      </Router>
  );
}

export default App
