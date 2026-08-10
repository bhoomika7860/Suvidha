import api from "../api/api";

const expenseService = {
  async getExpenses(reportId) {
    const response = await api.get(
      "/expenses/",
      {
        params: {
          report_id: Number(reportId),
        },
      }
    );

    return response.data;
  },

  async getExpense(id) {
    const response = await api.get(
      `/expenses/${id}`
    );

    return response.data;
  },

  async createExpense(expense) {
    const response = await api.post(
      "/expenses/",
      {
        daily_report_id: Number(
          expense.daily_report_id
        ),
        expense_type: expense.expense_type,
        amount: Number(expense.amount),
        remarks: expense.remarks || null,
      }
    );

    return response.data;
  },

  async updateExpense(id, expense) {
    const response = await api.put(
      `/expenses/${id}`,
      {
        expense_type: expense.expense_type,
        amount: Number(expense.amount),
        remarks: expense.remarks || null,
      }
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