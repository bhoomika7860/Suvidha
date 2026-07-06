import { api } from "./api";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/login", credentials);

    const token = response.data.access_token;

    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};