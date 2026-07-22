import api from "../api/api";

const udhaarService = {
  getAll: async () => {
    const response = await api.get("/udhaar");
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/udhaar", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/udhaar/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/udhaar/${id}`);
    return response.data;
  },
};

export default udhaarService;