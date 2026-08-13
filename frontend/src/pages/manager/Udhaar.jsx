import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import udhaarService from "../../services/udhaarService";
import dailyReportsService from "../../services/dailyReportsService";

import { useBusinessDate } from "../../contexts/BusinessDateContext";

import UdhaarKPIs from "../../components/udhaar/UdhaarKPIs";
import UdhaarTable from "../../components/udhaar/UdhaarTable";
import AddUdhaarModal from "../../components/udhaar/AddUdhaarModal";
import RepayModal from "../../components/udhaar/RepayModal";

export default function Udhaar() {
  const { selectedDate } =
    useBusinessDate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isOwner =
    user?.role === "owner";

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

  const [report, setReport] =
    useState(null);

  useEffect(() => {
    loadPage();
  }, [selectedDate, searchParams]);

  async function loadPage() {
    try {
      setLoading(true);

      const reportParam =
        searchParams.get("report");

      let selectedReport;

      /*
       * Historical report.
       */

      if (reportParam) {
        selectedReport =
          await dailyReportsService.getReport(
            Number(reportParam)
          );
      }

      /*
       * Normal Udhaar page.
       *
       * Follow global Business Date.
       */

      else if (!isOwner) {
        selectedReport =
          await dailyReportsService.getOrCreateReport(
            selectedDate
          );
      }

      /*
       * Owner does not need a store daily report
       * unless a historical report is explicitly opened.
       */

      setReport(
        selectedReport || null
      );

      const reportId =
        selectedReport?.id
          ? Number(selectedReport.id)
          : null;

      const data =
        await udhaarService.getUdhaar(
          reportId
        );

      console.log(
        "UDHAAR BUSINESS DATE:",
        selectedDate
      );

      console.log(
        "UDHAAR REPORT:",
        selectedReport
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

  async function addUdhaar(newEntries) {
    if (!report?.id) {
      console.error(
        "Cannot add Udhaar: report missing."
      );
      return;
    }

    try {
      await udhaarService.createUdhaar(
        Number(report.id),
        newEntries
      );

      setShowAdd(false);

      await loadPage();

    } catch (err) {
      console.error(
        "Failed to add Udhaar:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to add Udhaar."
      );
    }
  }

  async function repay(id, amount) {
    try {
      await udhaarService.repayUdhaar(
        id,
        amount
      );

      setShowRepay(false);
      setSelected(null);

      await loadPage();

    } catch (err) {
      console.error(
        "Failed to repay Udhaar:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to repay Udhaar."
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

          <p className="mt-2 text-sm font-medium text-blue-600">
            Business Date: {report?.report_date || selectedDate}
          </p>
        </div>

        {!isOwner && (
          <button
            onClick={() =>
              setShowAdd(true)
            }
            disabled={
              !report ||
              report.is_locked
            }
            className={`rounded-xl px-5 py-2.5 font-semibold text-white ${
              report && !report.is_locked
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Add Udhaar
          </button>
        )}

      </div>

      <UdhaarKPIs
        entries={entries}
      />

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center">
          Loading...
        </div>
      ) : (
        <UdhaarTable
          entries={entries}
          onRepay={
            isOwner || report?.is_locked
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
          onClose={() =>
            setShowAdd(false)
          }
          onSave={addUdhaar}
          dailyReportId={report?.id}
        />
      )}

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