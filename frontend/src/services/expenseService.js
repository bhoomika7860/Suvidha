import api from "../api/api";

const expenseService = {
  getExpenses: async () => {
    const response = await api.get("/expenses/");
    return response.data;
  },
createExpense: async (expense) => {
  console.log("Sending Expense:", expense);

  const response = await api.post(
    "/expenses/",
    expense
  );

  return response.data;
},
  getExpense: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (expense) => {
    const response = await api.post(
      "/expenses/",
      expense
    );

    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(
      `/expenses/${id}`
    );

    return response.data;
  },
};

export default expenseService;