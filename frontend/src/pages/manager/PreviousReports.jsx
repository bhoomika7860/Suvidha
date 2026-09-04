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

  const [currentPage, setCurrentPage] =
    useState(1);

  const [search, setSearch] = useState("");

  const reportsPerPage = 10;


  useEffect(() => {
    loadReports();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  async function loadReports() {
    try {
      const data =
        await dailyReportsService.getPreviousReports();

      setReports(
        dailyReportsService.formatReports(data)
      );
    } catch (err) {
      console.error(
        "Failed to load previous reports:",
        err
      );
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
      console.error(
        "Failed to load report details:",
        err
      );
    }
  }


  const filteredReports =
    reports.filter((report) =>
      report.date
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  const totalPages = Math.ceil(
    filteredReports.length /
      reportsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    reportsPerPage;


  const currentReports =
    filteredReports.slice(
      startIndex,
      startIndex + reportsPerPage
    );


  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden space-y-6 lg:block">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold">
            Previous Reports
          </h1>

          <p className="mt-1 text-gray-500">
            View your store's submitted reports.
          </p>
        </div>


        {/* SEARCH */}

        <ReportsToolbar
          search={search}
          setSearch={setSearch}
        />


        {/* REPORTS */}

        <ReportsTable
          reports={currentReports}
          onOpen={openReport}
        />


        {/* PAGINATION */}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 pb-24 lg:hidden">

        {/* HEADER */}

        <div className="border-b border-gray-200 bg-white px-5 py-4">

          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Previous Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your store's submitted reports.
          </p>

        </div>


        {/* CONTENT */}

        <div className="space-y-3 px-4 pt-4">

          {/* SEARCH */}

          <ReportsToolbar
            search={search}
            setSearch={setSearch}
          />


          {/* REPORT CARDS */}

          <ReportsTable
            reports={currentReports}
            onOpen={openReport}
          />


          {/* PAGINATION */}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

        </div>

      </div>


      {/* =====================================================
          DETAIL DRAWER
      ===================================================== */}

      <ReportDrawer
        report={selectedReport}
        isOpen={
          selectedReport !== null
        }
        onClose={() =>
          setSelectedReport(null)
        }
      />

    </div>
  );
}