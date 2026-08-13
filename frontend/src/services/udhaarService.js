import api from "../api/api";

const udhaarService = {

  getUdhaar: async (
    reportId = null
  ) => {
    const response =
      await api.get(
        "/udhaar/",
        {
          params:
            reportId !== null
              ? {
                  report_id:
                    Number(reportId),
                }
              : {},
        }
      );

    return response.data;
  },

  getOutstanding: async (
    reportId = null
  ) => {
    const response =
      await api.get(
        "/udhaar/outstanding",
        {
          params:
            reportId !== null
              ? {
                  report_id:
                    Number(reportId),
                }
              : {},
        }
      );

    return response.data;
  },

  createUdhaar: async (
    dailyReportId,
    entries
  ) => {
    const response =
      await api.post(
        "/udhaar/",
        {
          daily_report_id:
            Number(dailyReportId),

          entries,
        }
      );

    return response.data;
  },

  repayUdhaar: async (
    id,
    amount
  ) => {
    const response =
      await api.post(
        `/udhaar/${id}/repay/`,
        {
          amount:
            Number(amount),
        }
      );

    return response.data;
  },
};

export default udhaarService;