import { useEffect, useState } from "react";

import udhaarService from "../../services/udhaarService";
import dailyReportsService from "../../services/dailyReportsService";

import UdhaarKPIs from "../../components/udhaar/UdhaarKPIs";
import UdhaarTable from "../../components/udhaar/UdhaarTable";
import AddUdhaarModal from "../../components/udhaar/AddUdhaarModal";
import RepayModal from "../../components/udhaar/RepayModal";

export default function Udhaar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isOwner = user?.role === "owner";

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
    try {
      setLoading(true);

      // Managers need today's report to create udhaar.
      if (!isOwner) {
        const report =
          await dailyReportsService.getTodayReport();

        setReportId(report.id);
      }

      const data =
        await udhaarService.getUdhaar();
        console.log("UDHAAR DATA:", data);
      setEntries(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addUdhaar(data) {
    try {
      await udhaarService.createUdhaar(data);

      setShowAdd(false);

      await loadPage();
    } catch (err) {
      console.error(err);
    }
  }

  async function repay(id, amount) {
    try {
      await udhaarService.repayUdhaar(id, amount);

      setShowRepay(false);

      await loadPage();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Udhaar
          </h1>

          <p className="mt-1 text-slate-500">
            Manage customer credit.
          </p>

        </div>

        {!isOwner && (
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Add Udhaar
          </button>
        )}

      </div>

      <UdhaarKPIs entries={entries} />

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center">
          Loading...
        </div>
      ) : (
        <UdhaarTable
          entries={entries}
          onRepay={
            isOwner
              ? undefined
              : (entry) => {
                  setSelected(entry);
                  setShowRepay(true);
                }
          }
          isOwner={isOwner}
        />
      )}

      {!isOwner && (
        <AddUdhaarModal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          onSave={addUdhaar}
          dailyReportId={reportId}
        />
      )}

      {!isOwner && (
        <RepayModal
          open={showRepay}
          entry={selected}
          onClose={() => setShowRepay(false)}
          onRepay={repay}
        />
      )}

    </div>
  );
}