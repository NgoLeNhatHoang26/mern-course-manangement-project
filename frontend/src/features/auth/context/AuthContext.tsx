import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { authService } from '@features/auth';
import { AuthState, AuthAction } from '../types/auth.types';
import { getAuthToken, clearAuthToken } from '../constants';


const initialState: AuthState = { user: null, loading: true };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INIT': return { ...state, loading: true };
    case 'SET_USER': return { user: action.payload, loading: false };
    case 'CLEAR_USER': return { user: null, loading: false };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    default: return state;
  }
};

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<React.Dispatch<AuthAction> | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      dispatch({ type: 'CLEAR_USER' });
      return;
    }

    authService.getMe()
      .then(user => dispatch({ type: 'SET_USER', payload: user }))
      .catch(() => {
        clearAuthToken();
        dispatch({ type: 'CLEAR_USER' });
      });
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const ctx = useContext(AuthStateContext); if (!ctx) throw Error('AuthStateContext missing');
  return ctx;
};
export const useAuthDispatch = () => {
  const ctx = useContext(AuthDispatchContext); if (!ctx) throw Error('AuthDispatchContext missing');
  return ctx;
};