import api from "../api/api";

export const adjustmentService = {
  getAdjustments: async () => {
    const response = await api.get("/adjustments/");
    return response.data;
  },

  approveAdjustment: async (id) => {
    const response = await api.post(`/adjustments/${id}/approve`);
    return response.data;
  },

  rejectAdjustment: async (id) => {
    const response = await api.post(`/adjustments/${id}/reject`);
    return response.data;
  },
};