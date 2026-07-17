import api from "../api/api";

const deliveryService = {
  getDeliveries: async () => {
    const response = await api.get("/deliveries/");
    return response.data;
  },

  createDelivery: async (delivery) => {
  const formData = new FormData();

  formData.append("daily_report_id", delivery.daily_report_id);
  formData.append("customer_name", delivery.customer_name);
  formData.append("status", delivery.status);

  formData.append("bill_number", delivery.bill_number || "");
  formData.append("payment", delivery.payment_amount || "");
  formData.append("payment_method", delivery.payment_method || "");
  formData.append("notes", delivery.notes || "");

  if (delivery.billImage) {
    formData.append("bill_image", delivery.billImage);
  }

  const response = await api.post(
    "/deliveries/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
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