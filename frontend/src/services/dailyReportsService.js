import api from "../api/api";

const formatReports = (reports) => {
  return reports.map((r) => {
    const cashSales = Number(r.cash_sales || 0);
    const upiSales = Number(r.upi_sales || 0);
    const cardSales = Number(r.card_sales || 0);
    const udhaarSales = Number(r.udhaar_sales || 0);
    const expenses = Number(r.total_expenses || 0);

    return {
      id: r.id,

      date: new Date(
        r.report_date
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      bills: r.total_bills ?? 0,

      /*
       * Total Sales
       *
       * Cash + UPI + Card + Udhaar + Expenses
       */
      sales:
        cashSales +
        upiSales +
        cardSales +
        udhaarSales +
        expenses,

      systemSales:
        Number(r.system_sales || 0),

      expenses,

      purchases:
        Number(r.total_purchases || 0),

      deliveries:
        r.deliveries ?? 0,

      status:
        r.is_locked
          ? "Locked"
          : "Open",

      store:
        r.store_name || "-",

      storeId:
        r.store_id,
    };
  });
};

const dailyReportsService = {
  // --------------------------------------------------
  // Previous Reports
  // --------------------------------------------------

  getPreviousReports: async () => {
    const response = await api.get(
      "/daily-reports/history"
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get All Reports
  // --------------------------------------------------

  getAllReports: async () => {
    const response = await api.get(
      "/daily-reports/"
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Store Reports
  // --------------------------------------------------

  getStoreReports: async (storeId) => {
    const response = await api.get(
      `/daily-reports/store/${storeId}`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Single Report
  // --------------------------------------------------

  getReport: async (reportId) => {
    const response = await api.get(
      `/daily-reports/${reportId}`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Lock Report
  // --------------------------------------------------

  lockReport: async (reportId) => {
    const response = await api.put(
      `/daily-reports/${reportId}/lock`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Today's Report
  // --------------------------------------------------

  getTodayReport: async () => {
    const response = await api.get(
      "/daily-reports/today"
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Report By Date
  // --------------------------------------------------

  getReportByDate: async (reportDate) => {
    const response = await api.get(
      `/daily-reports/date/${reportDate}`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Or Create Report
  // --------------------------------------------------

  getOrCreateReport: async (reportDate) => {
    const response = await api.get(
      `/daily-reports/date/${reportDate}`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Calendar Status
  // --------------------------------------------------

  getCalendarStatus: async (
    year,
    month
  ) => {
    const response = await api.get(
      `/daily-reports/calendar/${year}/${month}`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Today's Reports
  // --------------------------------------------------

  getTodayReports: async () => {
    const response = await api.get(
      "/daily-reports/today/all"
    );

    return response.data;
  },

  // --------------------------------------------------
  // Update Sales
  // --------------------------------------------------

  updateSales: async (
    reportId,
    payload
  ) => {
    const response = await api.put(
      `/daily-reports/${reportId}/sales`,
      payload
    );

    return response.data;
  },

  // --------------------------------------------------
  // Update Notes
  // --------------------------------------------------

  updateNotes: async (
    reportId,
    notes
  ) => {
    const response = await api.put(
      `/daily-reports/${reportId}/notes`,
      {
        notes,
      }
    );

    return response.data;
  },

  // --------------------------------------------------
  // Submit Report
  // --------------------------------------------------

  submitReport: async (reportId) => {
    const response = await api.post(
      `/daily-reports/${reportId}/submit`
    );

    return response.data;
  },

  // --------------------------------------------------
  // GET EXPENSES FOR DAILY REPORT
  // --------------------------------------------------

  getExpenses: async (reportId) => {
    const response = await api.get(
      "/expenses/",
      {
        params: {
          report_id: Number(reportId),
        },
      }
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Purchases For Report
  // --------------------------------------------------

  getPurchases: async (reportId) => {
    const response = await api.get(
      `/daily-reports/${reportId}/purchases`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Update Deliveries
  // --------------------------------------------------

  updateDeliveries: async (
    reportId,
    deliveries
  ) => {
    const response = await api.put(
      `/daily-reports/${reportId}/deliveries`,
      {
        deliveries,
      }
    );

    return response.data;
  },

  // --------------------------------------------------
  // Get Bounced Products
  // --------------------------------------------------

  getBouncedProducts: async (reportId) => {
    const response = await api.get(
      `/daily-reports/${reportId}/bounced-products`
    );

    return response.data;
  },

  // --------------------------------------------------
  // Format Reports
  // --------------------------------------------------

  formatReports,
};

export default dailyReportsService;