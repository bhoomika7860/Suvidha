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

  const [searchParams] =
    useSearchParams();

  const [entries, setEntries] =
    useState([]);

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
  // Load Udhaar
  // --------------------------------------------------

  useEffect(() => {
    loadPage();
  }, [searchParams]);

  async function loadPage() {
    try {
      setLoading(true);

      const reportParam =
        searchParams.get("report");

      let selectedReportId = null;

      // --------------------------------------------------
      // Historical Daily Report
      // --------------------------------------------------

      if (reportParam) {
        const report =
          await dailyReportsService.getReport(
            Number(reportParam)
          );

        selectedReportId = report.id;
      }

      // --------------------------------------------------
      // Normal manager Udhaar page
      // --------------------------------------------------

      else if (!isOwner) {
        const report =
          await dailyReportsService.getTodayReport();

        selectedReportId = report.id;
      }

      setReportId(
        selectedReportId
          ? Number(selectedReportId)
          : null
      );

      // --------------------------------------------------
      // IMPORTANT
      //
      // If reportId exists:
      // backend applies the selected-date logic.
      //
      // If reportId does not exist:
      // backend returns current active Udhaar.
      // --------------------------------------------------

      const data =
        await udhaarService.getUdhaar(
          selectedReportId
            ? Number(selectedReportId)
            : null
        );

      console.log(
        "UDHAAR DATA:",
        data
      );

      setEntries(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(
        "Failed to load Udhaar:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setEntries([]);

    } finally {
      setLoading(false);
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

      await loadPage();

    } catch (err) {
      console.error(
        "Failed to add Udhaar:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
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

      // Reload the same selected report.
      await loadPage();

    } catch (err) {
      console.error(
        "Failed to repay Udhaar:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );
    }
  }

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

      {/* Add */}

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