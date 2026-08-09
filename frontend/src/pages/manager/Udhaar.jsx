import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import udhaarService from "../../services/udhaarService";
import dailyReportsService from "../../services/dailyReportsService";

import UdhaarKPIs from "../../components/udhaar/UdhaarKPIs";
import UdhaarTable from "../../components/udhaar/UdhaarTable";
import AddUdhaarModal from "../../components/udhaar/AddUdhaarModal";
import RepayModal from "../../components/udhaar/RepayModal";

export default function Udhaar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isOwner = user?.role === "owner";

  const [searchParams] = useSearchParams();

  const [entries, setEntries] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showAdd, setShowAdd] =
    useState(false);

  const [showRepay, setShowRepay] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [reportId, setReportId] =
    useState(null);

  // --------------------------------------------------
  // Initialize page
  // --------------------------------------------------

  useEffect(() => {
    initializePage();
  }, [searchParams]);

  async function initializePage() {
    try {
      setLoading(true);

      let id =
        searchParams.get("report");

      /*
       * If the page was opened from a
       * previous report, use that report.
       *
       * Example:
       * /manager/udhaar?report=20
       *
       * Otherwise use today's report.
       */

      if (!id) {
        const report =
          await dailyReportsService.getTodayReport();

        id = report.id;
      }

      id = Number(id);

      setReportId(id);

      await loadUdhaar(id);

    } catch (err) {
      console.error(
        "Failed to initialize Udhaar:",
        err
      );

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Backend Response:",
        err.response?.data
      );

    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Load Udhaar for selected report
  // --------------------------------------------------

  async function loadUdhaar(id = reportId) {
    if (!id) return;

    try {
      const data =
        await udhaarService.getUdhaar(
          Number(id)
        );

      console.log(
        "UDHAAR DATA:",
        data
      );

      setEntries(data);

    } catch (err) {
      console.error(
        "Failed to load Udhaar:",
        err
      );

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Headers:",
        err.response?.headers
      );

      console.log(
        "Backend Response:"
      );

      console.log(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

      setEntries([]);
    }
  }

  // --------------------------------------------------
  // Add Udhaar
  // --------------------------------------------------

  async function addUdhaar(newEntries) {
    if (!reportId) {
      console.error(
        "Cannot add Udhaar: report ID is missing."
      );
      return;
    }

    try {
      await udhaarService.createUdhaar(
        Number(reportId),
        newEntries
      );

      setShowAdd(false);

      await loadUdhaar(reportId);

    } catch (err) {
      console.error(
        "Failed to add Udhaar:",
        err
      );

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Headers:",
        err.response?.headers
      );

      console.log(
        "Backend Response:"
      );

      console.log(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );
    }
  }

  // --------------------------------------------------
  // Repay Udhaar
  // --------------------------------------------------

  async function repay(id, amount) {
    try {
      await udhaarService.repayUdhaar(
        id,
        amount
      );

      setShowRepay(false);
      setSelected(null);

      await loadUdhaar(reportId);

    } catch (err) {
      console.error(
        "Failed to repay Udhaar:",
        err
      );

      console.log(
        "Status:",
        err.response?.status
      );

      console.log(
        "Headers:",
        err.response?.headers
      );

      console.log(
        "Backend Response:"
      );

      console.log(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* Header */}

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
            onClick={() =>
              setShowAdd(true)
            }
            disabled={!reportId}
            className={`rounded-xl px-5 py-2.5 font-semibold text-white ${
              reportId
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Add Udhaar
          </button>
        )}

      </div>

      {/* KPIs */}

      <UdhaarKPIs
        entries={entries}
      />

      {/* Table */}

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

      {/* Add Udhaar */}

      {!isOwner && (
        <AddUdhaarModal
          open={showAdd}
          onClose={() =>
            setShowAdd(false)
          }
          onSave={addUdhaar}
          dailyReportId={reportId}
        />
      )}

      {/* Repay */}

      {!isOwner && (
        <RepayModal
          open={showRepay}
          entry={selected}
          onClose={() => {
            setShowRepay(false);
            setSelected(null);
          }}
          onRepay={repay}
        />
      )}

    </div>
  );
}