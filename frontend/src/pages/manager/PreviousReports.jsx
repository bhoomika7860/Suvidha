import { useEffect, useState } from "react";

import ReportsToolbar from "../../components/previousReports/ReportsToolbar";
import ReportsTable from "../../components/previousReports/ReportsTable";
import ReportDrawer from "../../components/previousReports/ReportDrawer";
import Pagination from "../../components/previousReports/Pagination";

import dailyReportsService from "../../services/dailyReportsService";

export default function PreviousReports() {
  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      let data;

      if (user.role === "owner") {
        data =
          await dailyReportsService.getAllReports();
      } else {
        data =
          await dailyReportsService.getStoreReports(
            user.store_id
          );
      }

      setReports(
        dailyReportsService.formatReports(data)
      );
    } catch (err) {
      console.error(err);
    }
  }

  const filteredReports = reports.filter(
    (report) =>
      report.date
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Previous Reports
        </h1>

        <p className="text-gray-500 mt-1">
          View all submitted reports.
        </p>

      </div>

      <ReportsToolbar
        search={search}
        setSearch={setSearch}
      />

      <ReportsTable
        reports={filteredReports}
        onOpen={setSelectedReport}
      />

      <Pagination />

      <ReportDrawer
        report={selectedReport}
        isOpen={selectedReport !== null}
        onClose={() =>
          setSelectedReport(null)
        }
      />

    </div>
  );
}