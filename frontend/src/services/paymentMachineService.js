import api from "../api/api";

const paymentMachineService = {

  async getMachines() {
    const res = await api.get("/payment-machines/");

    console.log("RAW AXIOS RESPONSE:", res);
    console.log("RAW DATA:", res.data);

  return res.data;
},

  async addMachine(data) {
    const res =
      await api.post(
        "/payment-machines/",
        data
      );
    return res.data;
  },

  async deleteMachine(id) {
    const res =
      await api.delete(
        `/payment-machines/${id}`
      );
    return res.data;
  },

};

export default paymentMachineService;