import api from "../api/api";

export const taskService = {
  getMyTasks: async () => {
  const response = await api.get("/tasks/my");
  return response.data;
},

  createTask: async (data) => {
    const response = await api.post("/tasks/", data);
    return response.data;
  },

  completeTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}/complete`, data);
    return response.data;
  },
};