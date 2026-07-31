import { useEffect, useState } from "react";

import udhaarService from "../../services/udhaarService";

import UdhaarKPIs from "../../components/udhaar/UdhaarKPIs";
import UdhaarTable from "../../components/udhaar/UdhaarTable";
import AddUdhaarModal from "../../components/udhaar/AddUdhaarModal";
import RepayModal from "../../components/udhaar/RepayModal";

import dailyReportsService from "../../services/dailyReportsService";

export default function Udhaar() {
  const [entries, setEntries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);

  const [showRepay, setShowRepay] = useState(false);

  const [selected, setSelected] = useState(null);

  const [reportId, setReportId] = useState(null);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    const report =
      await dailyReportsService.getTodayReport();

    setReportId(report.id);

    const data =
      await udhaarService.getUdhaar();

    setEntries(data);

    setLoading(false);
  }

  async function addUdhaar(data) {
    await udhaarService.createUdhaar(data);

    loadPage();
  }

  async function repay(id, amount) {
    await udhaarService.repayUdhaar(
      id,
      amount
    );

    loadPage();
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Udhaar
          </h1>

          <p className="text-slate-500 mt-1">
            Manage customer credit.
          </p>

        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Add Udhaar
        </button>

      </div>

      <UdhaarKPIs entries={entries} />

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center">
          Loading...
        </div>
      ) : (
        <UdhaarTable
          entries={entries}
          onRepay={(entry) => {
            setSelected(entry);
            setShowRepay(true);
          }}
        />
      )}

      <AddUdhaarModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={addUdhaar}
        dailyReportId={reportId}
      />

      <RepayModal
        open={showRepay}
        entry={selected}
        onClose={() => setShowRepay(false)}
        onRepay={repay}
      />

    </div>
  );
}