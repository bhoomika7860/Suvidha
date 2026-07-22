import api from "../api/api";

const storesService = {
  getStores: async () => {
    const response = await api.get("/stores");
    return response.data;
  },
};

export default storesService;