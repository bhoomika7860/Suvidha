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

  const [currentPage, setCurrentPage] = useState(1);

const reportsPerPage = 10;
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [search]);

  async function loadReports() {
    try {
      const data =
  await dailyReportsService.getAllReports();
      setReports(
        dailyReportsService.formatReports(data)
      );

    } catch (err) {
      console.error(err);
    }
  }

  async function openReport(report) {
    try {

      const details =
        await dailyReportsService.getReport(
          report.id
        );

      const expenses =
        await dailyReportsService.getExpenses(
          report.id
        );

      const purchases =
        await dailyReportsService.getPurchases(
          report.id
        );

      setSelectedReport({
        ...details,
        expenses,
        purchases,
      });

    } catch (err) {
      console.error(err);
    }
  }

  const filteredReports = reports.filter((report) =>
  report.date
    .toLowerCase()
    .includes(search.toLowerCase())
);

const totalPages = Math.ceil(
  filteredReports.length / reportsPerPage
);

const startIndex =
  (currentPage - 1) * reportsPerPage;

const currentReports =
  filteredReports.slice(
    startIndex,
    startIndex + reportsPerPage
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
  reports={currentReports}
  onOpen={openReport}
/>
      {totalPages > 1 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}
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