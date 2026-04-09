export interface User {
    id: string;
    userName: string;
    email: string;
    role: string;
    avatarUrl?: string;
    createdAt: string | Date;
    isActive: boolean;
}
export interface AuthState {
    user: User | null;
    loading: boolean;
    error?: string;
}
export type AuthAction =
  | { type: 'INIT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string };
