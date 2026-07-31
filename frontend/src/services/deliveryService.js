import api from "../api/api";

const deliveryService = {
  // Get today's delivery task assigned to the logged-in delivery boy
  getTodayDeliveryTask: async () => {
    const response = await api.get("/tasks/my");

    const tasks = response.data || [];

    const deliveryTask = tasks.find(
      (task) =>
        task.type === "delivery" ||
        task.role === "delivery"
    );

    return deliveryTask || null;
  },

  // Submit completed deliveries
  submitCompletedDeliveries: async (
    taskId,
    completedQuantity
  ) => {
    const formData = new FormData();

    formData.append(
      "completed_quantity",
      completedQuantity
    );

    formData.append("note", "");

    const response = await api.put(
      `/tasks/${taskId}/complete`,
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
};

export default deliveryService;