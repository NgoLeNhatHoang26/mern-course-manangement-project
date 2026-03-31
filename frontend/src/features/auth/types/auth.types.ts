export interface User { id: string; name: string; email:string; role:string }
export interface AuthState { user: User | null; loading: boolean; error?: string; }
export type AuthAction =
  | { type: 'INIT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string };
