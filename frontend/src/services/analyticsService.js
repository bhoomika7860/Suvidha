import api from "../api/api"; 

const analyticsService = {

  exportExcel: async (period = "today", store = "all") => {
  const response = await api.get("/analytics/export/excel", {
    params: {
      period,
      store_id: store,
    },
    responseType: "blob",
  });

  

  return response.data;
},

exportPDF: async (period = "today", store = "all") => {
  const response = await api.get("/analytics/export/pdf", {
    params: {
      period,
      store_id: store,
    },
    responseType: "blob",
  });

  return response.data;
},
  getDashboardSummary: (period = "today", store = "all") =>
    api.get("/analytics/dashboard-summary", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getStoreSummary: (period = "today", store = "all") =>
    api.get("/analytics/store-summary", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getOutstandingUdhaar: (period = "today", store = "all") =>
    api.get("/analytics/outstanding-udhaar", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getPaymentBreakdown: (period = "today", store = "all") =>
    api.get("/analytics/payment-breakdown", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getExpenseDistribution: (period = "today", store = "all") =>
    api.get("/analytics/expense-distribution", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getSalesTrend: (period = "today", store = "all") =>
    api.get("/analytics/sales-trend", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getTopBouncedProducts: (period = "today", store = "all") =>
    api.get("/analytics/top-bounced-products", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  

  getPerformance: (period = "today", store = "all") =>
    api.get("/analytics/performance", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

  getOverview: (period = "today", store = "all") =>
    api.get("/analytics/overview", {
      params: {
        period,
        store_id: store,
      },
    }).then((r) => r.data),

getManagerHero: () =>
  api.get("/analytics/manager-hero")
     .then((r) => r.data),

getManagerDashboard: () =>
  api.get("/analytics/manager-dashboard")
     .then((r) => r.data),
     
};

export default analyticsService;