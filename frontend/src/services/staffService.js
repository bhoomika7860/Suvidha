import api from "../api/api";

export const staffService = {
  getUsers: async () => {
    const response = await api.get("/users/");
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getEmployeePerformance: async (id) => {
    const response = await api.get(`/users/${id}/performance`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post("/users/", data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteEmployee(id) {
  return api.delete(`/users/${id}`);
},
};