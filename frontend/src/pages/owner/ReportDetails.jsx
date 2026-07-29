import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { dailyReportsService } from "../../services/dailyReportsService";

import SummaryCards from "../../components/reportDetails/SummaryCards";
import PaymentBreakdown from "../../components/reportDetails/PaymentBreakdown";
import ExpenseBreakdown from "../../components/reportDetails/ExpenseBreakdown";

import NotesCard from "../../components/reportDetails/NotesCard";
import AdjustmentHistory from "../../components/reportDetails/AdjustmentHistory";

export default function ReportDetails() {
  const navigate = useNavigate();

const { id } = useParams();

const [report, setReport] = useState(null);

const [loading, setLoading] = useState(true);

useEffect(() => {

    const fetchReport = async () => {

        try {

            const data = await dailyReportsService.getReport(id);

            console.log(data);

            setReport(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    fetchReport();

}, [id]);

if (loading) {

    return (

        <div className="flex items-center justify-center h-screen">

            Loading report...

        </div>

    );

}

if (!report) {

    return (

        <div className="flex items-center justify-center h-screen">

            Report not found

        </div>

    );

}

  return (
    <main className="flex-1 bg-[#F8FAFC] overflow-y-auto px-8 py-8">

      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/daily-reports")}
          className="flex items-center gap-2 text-[#1D4ED8] font-medium mb-6 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Daily Reports
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                {report.store.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {report.report_date}
              </p>

            </div>

            <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              {report.status}
            </span>

          </div>

        </div>

        <SummaryCards />

        <div className="grid grid-cols-2 gap-6 mt-6">

          <PaymentBreakdown />

          <ExpenseBreakdown />

        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">

        

          <NotesCard />

        </div>

        <div className="mt-6">

          <AdjustmentHistory />

        </div>

      </div>

    </main>
  );
}