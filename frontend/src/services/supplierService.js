import api from "../api/api";

const supplierService = {
  // Active suppliers.
  // Used by purchase forms and the Owner Suppliers page.
  getSuppliers: async () => {
    const response = await api.get("/suppliers/");
    return response.data;
  },

  // Keep this method for existing code,
  // but use the same verified active-supplier endpoint.
  getAllSuppliers: async () => {
    const response = await api.get("/suppliers/");
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