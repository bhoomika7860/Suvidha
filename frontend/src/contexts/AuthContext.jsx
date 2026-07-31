import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        authService.logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);

console.log("RESULT:", result);
console.log("ACCESS TOKEN:", result.access_token);

    localStorage.setItem("token", result.access_token);

    const currentUser = await authService.getCurrentUser();

    localStorage.setItem("user", JSON.stringify(currentUser));

    setUser(currentUser);

    return currentUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}