import { useAuthDispatch } from '@features/auth';
import { authService} from '@features/auth';
import { setAuthToken, clearAuthToken } from '../constants';
import type { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

export const useAuthActions = () => {
  const dispatch = useAuthDispatch();

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    dispatch({ type: 'INIT' });
    try {
      const data = await authService.login(credentials);
      setAuthToken(data.token);
      dispatch({ type: 'SET_USER', payload: data.user });
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const logout = (): void => {
    clearAuthToken();
    dispatch({ type: 'CLEAR_USER' });
  };

  return { login, logout };
};