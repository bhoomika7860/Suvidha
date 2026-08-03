import api from "../api/api";

const paymentMachineEntryService = {

  async get(reportId) {
    const response =
      await api.get(
        `/payment-machine-entries/${reportId}`
      );

    return response.data;
  },

  async save(data) {
    const response =
      await api.post(
        "/payment-machine-entries/",
        data
      );

    return response.data;
  },

};

export default paymentMachineEntryService;