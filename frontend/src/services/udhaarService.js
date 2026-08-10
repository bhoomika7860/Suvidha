import api from "../api/api";

const udhaarService = {
  // Get Udhaar entries.
  // If reportId is provided, only return entries
  // belonging to that daily report.
  getUdhaar: async (reportId = null) => {
    const response = await api.get("/udhaar/", {
      params: reportId
        ? {
            report_id: reportId,
          }
        : {},
    });

    return response.data;
  },

  // Get outstanding Udhaar.
  // If reportId is provided, calculate outstanding
  // only for that daily report.
  getOutstanding: async (reportId = null) => {
    const response = await api.get(
      "/udhaar/outstanding",
      {
        params: reportId
          ? {
              report_id: reportId,
            }
          : {},
      }
    );

    return response.data;
  },

  // Create Udhaar entries for a specific daily report.
  createUdhaar: async (
    dailyReportId,
    entries
  ) => {
    const response = await api.post(
      "/udhaar/",
      {
        daily_report_id: dailyReportId,
        entries,
      }
    );

    return response.data;
  },

  // Repay an Udhaar entry.
  repayUdhaar: async (id, amount) => {
    const response = await api.post(
      `/udhaar/${id}/repay/`,
      {
        amount,
      }
    );

    return response.data;
  },
};

export default udhaarService;