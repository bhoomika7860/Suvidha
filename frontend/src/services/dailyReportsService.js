import api from "../api/api";

const formatReports = (reports) => {
  return reports.map((r) => ({
    id: r.id,

    store: r.store_name,

    payment: {
      cash: r.cash_sales,
      upi: r.upi_sales,
      card: r.card_sales,
      udhaar: r.udhaar_sales,
    },

    deliveries: r.deliveries ?? 0,

    totalSales:
      (r.cash_sales ?? 0) +
      (r.upi_sales ?? 0) +
      (r.card_sales ?? 0) +
      (r.udhaar_sales ?? 0),

    purchases: r.total_purchases ?? 0,

    expenses: r.total_expenses ?? 0,

    bills: r.total_bills ?? 0,

    bouncedProducts: r.bounced_products ?? [],

    status: r.is_locked ? "Locked" : "Open",
  }));
};

const dailyReportsService = {
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

lockReport: async (reportId) => {
  const response = await api.put(`/daily-reports/${reportId}/lock`);
  return response.data;
},

formatReports,

};

export default dailyReportsService;