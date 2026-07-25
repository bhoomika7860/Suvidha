import api from "../api/api";

export const taskService = {
  getTasks: async () => {
    const response = await api.get("/tasks/");
    return response.data;
  },

  getMyTasks: async () => {
    const response = await api.get("/tasks/my");
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post("/tasks/", data);
    return response.data;
  },

  completeTask: async (id, task) => {
  const formData = new FormData();

  formData.append(
    "completed_quantity",
    task.completed_quantity
  );

  formData.append(
    "note",
    task.note || ""
  );

  if (task.photo instanceof File) {
    formData.append(
      "photo",
      task.photo
    );
  }

  const response = await api.put(
    `/tasks/${id}/complete`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
},
};