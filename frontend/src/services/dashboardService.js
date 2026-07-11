import analyticsService from "./analyticsService";
import api from "../api/api";

const dashboardService = {
  async getDashboardData() {
    const summary = await analyticsService.getDashboardSummary();

    const stores = await api.get("/stores");

    const storeSummary = await analyticsService.getStoreSummary();

    return {
      summary,

      totalStores: stores.data.length,

      storeSummary,

      salesData: storeSummary.map((store) => ({
        name: store.store_name,
        value: store.total_sales,
      })),

      comparisonData: storeSummary.map((store) => ({
        store: store.store_name,
        sales: store.total_sales,
        purchases: store.total_purchases,
      })),
    };
  },
};

export default dashboardService;