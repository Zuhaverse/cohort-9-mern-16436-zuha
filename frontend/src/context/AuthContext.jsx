import { useEffect, useRef, useState } from "react";
import {
  verifySession,
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";
import { AuthContext } from "./AuthContextValue";

/**
 * Provides authentication state and actions to the application.
 * @param {{ children: import("react").ReactNode }} props
 */
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
    } catch {
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
    // Session verification intentionally runs once when AuthProvider mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession();
  }, []);

  const login = async ({ email, password }) => {
    const operationId = ++authOperationRef.current;

    setLoading(true);

    try {
      await loginUser({ email, password });

      if (operationId !== authOperationRef.current) return;

      const response = await verifySession();

      if (operationId !== authOperationRef.current) return;

      setUser(response.data.user);
    } catch (error) {
      if (operationId !== authOperationRef.current) return;

      setUser(null);
      throw error;
    } finally {
      if (operationId === authOperationRef.current) {
        setLoading(false);
      }
    }
  };

  const register = async (userData) => {
    return registerUser(userData);
  };

  const logout = async () => {
    const operationId = ++authOperationRef.current;
  
    try {
      await logoutUser();
  
      if (operationId === authOperationRef.current) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
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