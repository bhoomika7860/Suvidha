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
        console.log("AUTH: existing token found");

        const currentUser =
          await authService.getCurrentUser();

        console.log(
          "AUTH: existing token verified",
          currentUser
        );

        setUser(currentUser);
      } catch (error) {
        console.error(
          "AUTH: existing token verification failed",
          error
        );

        authService.logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      console.log(
        "LOGIN: sending credentials",
        username
      );

      const result =
        await authService.login(
          username,
          password
        );

      console.log(
        "LOGIN: response received",
        result
      );

      if (!result?.access_token) {
        throw new Error(
          result?.message || "Login failed"
        );
      }

      localStorage.setItem(
        "token",
        result.access_token
      );

      console.log(
        "LOGIN: token saved"
      );

      const currentUser =
        await authService.getCurrentUser();

      console.log(
        "LOGIN: /me successful",
        currentUser
      );

      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      console.error(
        "LOGIN FLOW FAILED:",
        error
      );

      throw error;
    }
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