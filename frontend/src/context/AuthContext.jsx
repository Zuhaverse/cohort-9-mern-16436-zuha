import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  verifySession,
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";

/**
 * Provides authentication state and actions to the application.
 * @param {{ children: import("react").ReactNode }} props
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authOperationRef = useRef(0);

  const checkSession = async () => {
    const operationId = ++authOperationRef.current;
  
    try {
      const response = await verifySession();
  
      if (operationId !== authOperationRef.current) return;
  
      setUser(response.data.user);
      return true;
    } catch (error) {
      if (operationId !== authOperationRef.current) return;
  
      setUser(null);
      return false;
    } finally {
      if (operationId === authOperationRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async ({ email, password }) => {
    const operationId = ++authOperationRef.current;
  
    const response = await loginUser(email, password);
  
    if (operationId !== authOperationRef.current) return;
  
    setUser(response.data.user);
  };

  const register = async (userData) => {
    return registerUser(userData);
  };

  const logout = async () => {
    ++authOperationRef.current;
  
    await logoutUser();
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}