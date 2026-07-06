import { api } from "./api";

export const dailyReportsService = {

  getAllReports: async () => {
    const response = await api.get("/daily-reports/");
    return response.data;
  },

  getStoreReports: async (storeId) => {
    const response = await api.get(`/daily-reports/store/${storeId}`);
    return response.data;
  },

  getReport: async (reportId) => {
    const response = await api.get(`/daily-reports/${reportId}`);
    return response.data;
  },

};