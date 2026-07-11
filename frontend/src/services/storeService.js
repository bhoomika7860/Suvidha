import api from "../api/api";

export const storeService = {
  getStores: async () => {
    const response = await api.get("/stores/");
    return response.data;
  },
};

export default storeService;