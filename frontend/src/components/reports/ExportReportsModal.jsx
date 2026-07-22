import { useState, useEffect } from "react";
import { X } from "lucide-react";
import analyticsService from "../../services/analyticsService";
import storeService from "../../services/storeService";

export default function ExportReportsModal({
    open,
    onClose,
    type = "reports",
}) {
  const [period, setPeriod] = useState("today");
  const [store, setStore] = useState("all");
  const [format, setFormat] = useState("excel");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [stores, setStores] = useState([]);

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    try {
      const data = await storeService.getStores();
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!open) return null;

  async function handleExport() {
    try {
      let blob;

      if (type === "analytics") {

    if (format === "excel") {

        blob =
            await analyticsService.exportAnalyticsExcel(
                period,
                store,
                fromDate,
                toDate
            );

    } else {

        blob =
            await analyticsService.exportAnalyticsPDF(
                period,
                store,
                fromDate,
                toDate
            );

    }

} else {

    if (format === "excel") {

        blob =
            await analyticsService.exportReportsExcel(
                period,
                store,
                fromDate,
                toDate
            );

    } else {

        blob =
            await analyticsService.exportReportsPDF(
                period,
                store,
                fromDate,
                toDate
            );

    }

}
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        format === "excel"
          ? "DailyReports.xlsx"
          : "DailyReports.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Export failed.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-[520px] p-6">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            Export Reports
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-5 mt-6">

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full h-11 border rounded-xl px-4"
          >
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {period === "custom" && (
            <>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-11 border rounded-xl px-4"
              />

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-11 border rounded-xl px-4"
              />
            </>
          )}

          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="w-full h-11 border rounded-xl px-4"
          >
            <option value="all">
              All Stores
            </option>

            {stores.map((s) => (
              <option
                key={s.id}
                value={s.id}
              >
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full h-11 border rounded-xl px-4"
          >
            <option value="excel">
              Excel
            </option>

            <option value="pdf">
              PDF
            </option>
          </select>

          <button
            type="button"
            onClick={handleExport}
            className="w-full h-12 rounded-xl bg-blue-600 text-white"
          >
            Export
          </button>

        </div>

      </div>

    </div>
  );
}