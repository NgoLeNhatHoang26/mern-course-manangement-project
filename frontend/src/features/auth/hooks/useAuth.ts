import { useAuthDispatch} from '../context/AuthContext';
import { authService } from '../services/authService';

export const useAuthActions = () => {

  const dispatch= useAuthDispatch();

  const login = async (credentials: any) => {
    dispatch({ type: 'INIT' });
    try {
      const data = await authService.login(credentials);
      // Lưu token vào localStorage ở đây nếu server không dùng HttpOnly Cookie
      localStorage.setItem('accessToken', data.token); 
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Login failed' });
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    dispatch({ type: 'CLEAR_USER' });
    window.location.href = '/signin';
  };

  return { login, logout };
};