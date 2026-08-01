import api from "../api/api";

const expenseService = {
  async getExpenses() {
    const response = await api.get("/expenses/");
    return response.data;
  },

  async getExpense(id) {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  async createExpense(expense) {
    console.log("Sending Expense:", expense);

    const response = await api.post(
      "/expenses/",
      expense
    );

    return response.data;
  },

  async updateExpense(id, expense) {
  const response = await api.put(
    `/expenses/${id}`,
    expense
  );

  return response.data;
},

  async deleteExpense(id) {
    const response = await api.delete(
      `/expenses/${id}`
    );

    return response.data;
  },
};

export default expenseService;