import api from "../api/api";

const purchaseService = {

  getPurchases: async () => {
    const response =
      await api.get(
        "/purchases/"
      );

    return response.data;
  },

  getTodayPurchases: async () => {
    const response =
      await api.get(
        "/purchases/today"
      );

    return response.data;
  },

  getStorePurchases: async (
    storeId
  ) => {
    const response =
      await api.get(
        `/purchases/store/${storeId}`
      );

    return response.data;
  },

  createPurchase: async (
    purchase
  ) => {
    const formData =
      new FormData();

    Object.entries(
      purchase
    ).forEach(
      ([key, value]) => {
        if (
          value !== null &&
          value !== undefined
        ) {
          formData.append(
            key,
            value
          );
        }
      }
    );

    const response =
      await api.post(
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

  updatePurchase: async (
    purchaseId,
    data
  ) => {
    const response =
      await api.put(
        `/purchases/${purchaseId}`,
        data
      );

    return response.data;
  },

  getOwnerPurchases: async (
    filters = {},
    page = 1,
    pageSize = 10
  ) => {
    const response =
      await api.get(
        "/purchases/owner",
        {
          params: {
            ...filters,
            page,
            page_size:
              pageSize,
          },
        }
      );

    return response.data;
  },
};

export default purchaseService;