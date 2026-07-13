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

getTodayReport: async () => {
  const response = await api.get("/daily-reports/today");
  return response.data;
},

updateSales: async (reportId, payload) => {
  const response = await api.put(
    `/daily-reports/${reportId}/sales`,
    payload
  );
  return response.data;
},

updateNotes: async (reportId, notes) => {
  const response = await api.put(
    `/daily-reports/${reportId}/notes`,
    { notes }
  );
  return response.data;
},

submitReport: async (reportId) => {
  const response = await api.post(
    `/daily-reports/${reportId}/submit`
  );
  return response.data;
},
getExpenses: async (reportId) => {
  const response = await api.get(
    `/daily-reports/${reportId}/expenses`
  );

  return response.data;
},

getPurchases: async (reportId) => {
  const response = await api.get(
    `/daily-reports/${reportId}/purchases`
  );

  return response.data;
},
updateDeliveries: async (reportId, deliveries) => {
  const response = await api.put(
    `/daily-reports/${reportId}/deliveries`,
    {
      deliveries,
    }
  );

  return response.data;
},

getBouncedProducts: async (reportId) => {
  const response = await api.get(
    `/daily-reports/${reportId}/bounced-products`
  );
  return response.data;
},

submitReport: async (reportId) => {
  const response = await api.post(
    `/daily-reports/${reportId}/submit`
  );

  return response.data;
},
formatReports,

};

export default dailyReportsService;