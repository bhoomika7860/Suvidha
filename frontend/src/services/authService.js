import api from "../api/api";

const authService = {
  async login(username, password) {
    const response = await api.post("/login", {
      username,
      password,
    });

    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/me");

    return response.data.user;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;