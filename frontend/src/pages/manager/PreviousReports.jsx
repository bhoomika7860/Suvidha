import { useState } from "react";

import ReportsToolbar from "../../components/previousReports/ReportsToolbar";
import ReportsTable from "../../components/previousReports/ReportsTable";
import ReportDrawer from "../../components/previousReports/ReportDrawer";
import Pagination from "../../components/previousReports/Pagination";

export default function PreviousReports() {

  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      id: 1,
      date: "09 Jul 2026",
      bills: 87,
      sales: 54100,
      expenses: 2200,
      purchases: 22500,
      deliveries: 12,
      status: "Submitted",
    },
    {
      id: 2,
      date: "08 Jul 2026",
      bills: 92,
      sales: 58700,
      expenses: 1800,
      purchases: 24100,
      deliveries: 18,
      status: "Submitted",
    },
    {
      id: 3,
      date: "07 Jul 2026",
      bills: 79,
      sales: 48200,
      expenses: 2100,
      purchases: 19900,
      deliveries: 10,
      status: "Submitted",
    },
  ];

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Previous Reports
        </h1>

        <p className="text-gray-500 mt-1">
          View all submitted reports for your store.
        </p>

      </div>

      <ReportsToolbar />

      <ReportsTable
        reports={reports}
        onOpen={setSelectedReport}
      />

      <Pagination />

      <ReportDrawer
        report={selectedReport}
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
      />

    </div>

  );

}