import api from "../api/api";
baseURL: "http://127.0.0.1:8000"
const purchaseService = {
  getPurchases: async () => {
    const response = await api.get("/purchases/");
    return response.data;
  },

  getTodayPurchases: async () => {
    const response = await api.get("/purchases/today");
    return response.data;
  },

  getStorePurchases: async (storeId) => {
    const response = await api.get(`/purchases/store/${storeId}`);
    return response.data;
  },

  createPurchase: async (purchase) => {
  const formData = new FormData();

  Object.entries(purchase).forEach(
    ([key, value]) => {
      if (
        value !== null &&
        value !== undefined
      ) {
        formData.append(key, value);
      }
    }
  );

  const response = await api.post(
    "/purchases/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
},
  
  updatePurchase: async (purchaseId, data) => {
  const response = await api.put(
    `/purchases/${purchaseId}`,
    data
  );

  return response.data;
},
  getPurchaseOrders: async () => {
  const response = await api.get("/purchase-orders/");
  return response.data;
},

createPurchaseOrder: async (order) => {
  console.log("Sending Purchase Order:", order);

  const response = await api.post(
    "/purchase-orders/",
    order
  );

  return response.data;
},

updatePurchaseOrderStatus: async (id, status) => {
  const response = await api.put(
    `/purchase-orders/${id}/status`,
    null,
    {
      params: {
        status,
      },
    }
  );

  return response.data;
},


};

export default purchaseService;