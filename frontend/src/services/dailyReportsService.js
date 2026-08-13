import api from "../api/api";

const formatReports = (reports) => {
  return reports.map((r) => {
    const cashSales =
      Number(r.cash_sales || 0);

    const upiSales =
      Number(r.upi_sales || 0);

    const cardSales =
      Number(r.card_sales || 0);

    const udhaarSales =
      Number(r.udhaar_sales || 0);

    const expenses =
      Number(r.total_expenses || 0);

    return {
      id: r.id,

      date: new Date(
        r.report_date
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      bills:
        r.total_bills ?? 0,

      /*
       * Sales should NOT include expenses.
       *
       * Expenses are a separate operational
       * metric, not sales revenue.
       */

      sales:
        cashSales +
        upiSales +
        cardSales +
        udhaarSales,

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

  getPreviousReports: async () => {
    const response =
      await api.get(
        "/daily-reports/history"
      );

    return response.data;
  },

  getAllReports: async () => {
    const response =
      await api.get(
        "/daily-reports/"
      );

    return response.data;
  },

  getStoreReports: async (storeId) => {
    const response =
      await api.get(
        `/daily-reports/store/${storeId}`
      );

    return response.data;
  },

  getReport: async (reportId) => {
    const response =
      await api.get(
        `/daily-reports/${reportId}`
      );

    return response.data;
  },

  lockReport: async (reportId) => {
    const response =
      await api.put(
        `/daily-reports/${reportId}/lock`
      );

    return response.data;
  },

  getTodayReport: async () => {
    const response =
      await api.get(
        "/daily-reports/today"
      );

    return response.data;
  },

  getReportByDate: async (
    reportDate
  ) => {
    const response =
      await api.get(
        `/daily-reports/date/${reportDate}`
      );

    return response.data;
  },

  /*
   * Business-date entry point.
   *
   * The selected business date is always
   * explicitly passed here.
   */

  getOrCreateReport: async (
    reportDate
  ) => {
    const response =
      await api.get(
        `/daily-reports/date/${reportDate}`
      );

    return response.data;
  },

  getCalendarStatus: async (
    year,
    month
  ) => {
    const response =
      await api.get(
        `/daily-reports/calendar/${year}/${month}`
      );

    return response.data;
  },

  getTodayReports: async () => {
    const response =
      await api.get(
        "/daily-reports/today/all"
      );

    return response.data;
  },

  updateSales: async (
    reportId,
    payload
  ) => {
    const response =
      await api.put(
        `/daily-reports/${reportId}/sales`,
        payload
      );

    return response.data;
  },

  updateNotes: async (
    reportId,
    notes
  ) => {
    const response =
      await api.put(
        `/daily-reports/${reportId}/notes`,
        {
          notes,
        }
      );

    return response.data;
  },

  submitReport: async (
    reportId
  ) => {
    const response =
      await api.post(
        `/daily-reports/${reportId}/submit`
      );

    return response.data;
  },

  getExpenses: async (
    reportId
  ) => {
    const response =
      await api.get(
        `/daily-reports/${reportId}/expenses`
      );

    return response.data;
  },

  getPurchases: async (
    reportId
  ) => {
    const response =
      await api.get(
        `/daily-reports/${reportId}/purchases`
      );

    return response.data;
  },

  updateDeliveries: async (
    reportId,
    deliveries
  ) => {
    const response =
      await api.put(
        `/daily-reports/${reportId}/deliveries`,
        {
          deliveries,
        }
      );

    return response.data;
  },

  getBouncedProducts: async (
    reportId
  ) => {
    const response =
      await api.get(
        `/daily-reports/${reportId}/bounced-products`
      );

    return response.data;
  },

  formatReports,
};

export default dailyReportsService;