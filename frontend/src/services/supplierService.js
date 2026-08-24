import api from "../api/api";

const supplierService = {
  getSuppliers: async () => {
    const response = await api.get("/suppliers/");
    return response.data;
  },

  getAllSuppliers: async () => {
    const response = await api.get("/suppliers/all");
    return response.data;
  },

  createSupplier: async (data) => {
    const response = await api.post(
      "/suppliers/",
      data
    );

    return response.data;
  },

  updateSupplier: async (supplierId, data) => {
    const response = await api.put(
      `/suppliers/${supplierId}`,
      data
    );

    return response.data;
  },
};

export default supplierService;