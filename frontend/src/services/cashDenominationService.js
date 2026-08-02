import api from "../api/api";

const cashDenominationService = {
  async get(reportId) {
    const response = await api.get(
      `/cash-denominations/${reportId}`
    );

    return response.data;
  },

  async save(data) {
    const response = await api.post(
      "/cash-denominations/",
      data
    );

    return response.data;
  },
};

export default cashDenominationService;