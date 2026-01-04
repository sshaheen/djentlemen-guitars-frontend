import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './AuthContext';
import BookLesson from './pages/BookLesson';
import TeacherLogin from './pages/TeacherLogin';
import TeacherHome from './pages/TeacherHome';
import ResetPassword from './pages/ResetPassword';
const API_URL = '/api/lessons';

const App = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, authFetch } = useAuth() || {};

  const location = useLocation();
  const navigate = useNavigate();

  const fetchLessons = async () => {
    if (!token) {
      setLessons([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = authFetch
        ? await authFetch(API_URL, { method: 'GET' })
        : await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setLessons(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const reloadFlag = location.state?.reload;
    if (reloadFlag) {
      fetchLessons().finally(() => {
        try {
          navigate(location.pathname, { replace: true, state: null });
        } catch (e) {}
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.reload]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <HomePage lessons={lessons} loading={loading} error={error} />
            </ProtectedRoute>
          }
        />
        <Route path='/about' element={<AboutPage />} />
        <Route
          path='/register'
          element={token ? <Navigate to='/' replace /> : <RegisterPage />}
        />
        <Route
          path='/book'
          element={
            <ProtectedRoute>
              <BookLesson />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/teacher-login' element={<TeacherLogin />} />
        <Route
          path='/teacher'
          element={
            <ProtectedRoute>
              <TeacherHome />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
