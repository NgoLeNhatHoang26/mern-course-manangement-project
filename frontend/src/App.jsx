import { Container, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CoursePage from './pages/CoursePage.jsx'
import HomePage from './pages/HomePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import MyCoursesPage from './pages/MyCoursesPage.jsx'
import MyProfilePage from './pages/MyProfilePage.jsx'
import SettingPage from './pages/SettingPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import SigninPage from './pages/SigninPage.jsx'
import './App.css'
function App() {

  return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Course Management
            </Typography>

            <Button variant="contained">
                Test MUI OK
            </Button>
        </Container>
  );
}

export default App
