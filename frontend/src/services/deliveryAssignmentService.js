import api from "../api/api";

const deliveryAssignmentService = {
  async getDeliveryBoys() {
    const { data } = await api.get(
      "/delivery-assignments/delivery-boys"
    );

    return data;
  },

  async getAssignments(reportId) {
    const { data } = await api.get(
      `/delivery-assignments/${reportId}`
    );

    return data;
  },

  async createAssignment(payload) {
    const { data } = await api.post(
      "/delivery-assignments",
      payload
    );

    return data;
  },
};

export default deliveryAssignmentService;