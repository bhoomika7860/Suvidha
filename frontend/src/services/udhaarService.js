import api from "../api/api";

const udhaarService = {
  async getUdhaar() {
    const res = await api.get("/udhaar/");
    return res.data;
  },

  async getOutstanding() {
    const res = await api.get("/udhaar/outstanding");
    return res.data;
  },

  async createUdhaar(data) {
    const res = await api.post("/udhaar/", data);
    return res.data;
  },

  async repayUdhaar(id, amount) {
    const res = await api.post(
      `/udhaar/${id}/repay/`,
      {
        amount,
      }
    );

    return res.data;
  },
};

export default udhaarService;