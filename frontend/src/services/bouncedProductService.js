import api from "../api/api";

const bouncedProductService = {
  getAll: async () => {
    const response = await api.get("/bounced-products/");
    return response.data;
  },

  create: async (product) => {
    const response = await api.post(
      "/bounced-products/",
      product
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/bounced-products/${id}`
    );
    return response.data;
  },
};

export default bouncedProductService;