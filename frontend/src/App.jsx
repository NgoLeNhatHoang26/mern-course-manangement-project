
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CoursePage from './pages/CoursePage.jsx'
import HomePage from './pages/HomePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import MyCoursesPage from './pages/MyCoursesPage.jsx'
import MyProfilePage from './pages/MyProfilePage.jsx'
import SettingPage from './pages/SettingPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import SigninPage from './pages/SigninPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import MainLayout from './components/layout/MainLayout.jsx';
import './App.css'
function App() {

  return (
      <Router>
          <Routes>
              <Route element={<MainLayout />} >
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses/:id" element={<CoursePage />} />
                  <Route path="/lessons/:id" element={<LessonPage />} />
                  <Route path="/my-courses" element={<MyCoursesPage />} />
                  <Route path="/my-profile" element={<MyProfilePage />} />
                  <Route path="/settings" element={<SettingPage />} />
                  <Route path="/my-courses" element={<MyCoursesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
              <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/signin" element={<SigninPage />} />
          </Routes>
      </Router>
  );
}

export default App
