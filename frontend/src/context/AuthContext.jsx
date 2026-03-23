import { createContext, useContext, useEffect, useState } from "react";
import {authService} from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user khi app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getMe(); // gọi API /auth/me
        setUser(res.data);
      } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // optional: clear token/localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook cho gọn
export const useAuth = () => useContext(AuthContext);