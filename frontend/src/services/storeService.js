import api from "../api/api";

const storesService = {
  getStores: async () => {
    const response = await api.get("/stores/");
    return response.data;
  },
deleteStore: async (id) => {
  const response = await api.delete(`/stores/${id}`);
  return response.data;
},
  getStore: async (id) => {
    const response = await api.get(
      `/stores/${id}`
    );

    return response.data;
  },

  createStore: async (store) => {
    const response = await api.post(
      "/stores/",
      store
    );

    return response.data;
  },

  updateStore: async (
    id,
    store
  ) => {
    const response = await api.put(
      `/stores/${id}`,
      store
    );

    return response.data;
  },

  deactivateStore: async (
    id
  ) => {
    const response = await api.delete(
      `/stores/${id}`
    );

    return response.data;
  },
};

export default storesService;