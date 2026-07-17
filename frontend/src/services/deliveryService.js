import api from "../api/api";

const deliveryService = {
  getDeliveries: async () => {
    const response = await api.get("/deliveries/");
    return response.data;
  },

  createDelivery: async (delivery) => {
    const response = await api.post(
      "/deliveries/",
      delivery
    );

    return response.data;
  },

  getDelivery: async (id) => {
    const response = await api.get(
      `/deliveries/${id}`
    );

    return response.data;
  },

  deleteDelivery: async (id) => {
    const response = await api.delete(
      `/deliveries/${id}`
    );

    return response.data;
  },

  updateDelivery: async (id, data) => {
    const response = await api.put(
      `/deliveries/${id}`,
      data
    );

    return response.data;
  },

  completeDelivery: async (id) => {
  const response = await api.put(
    `/deliveries/${id}/complete`
  );

  return response.data;
},
};

export default deliveryService;