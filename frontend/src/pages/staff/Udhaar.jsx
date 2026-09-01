import { useEffect, useState } from "react";

import udhaarService from "../../services/udhaarService";
import dailyReportsService from "../../services/dailyReportsService";

import UdhaarKPIs from "../../components/udhaar/UdhaarKPIs";
import UdhaarTable from "../../components/udhaar/UdhaarTable";
import AddUdhaarModal from "../../components/udhaar/AddUdhaarModal";
import RepayModal from "../../components/udhaar/RepayModal";

export default function Udhaar() {
  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const isOwner =
    user?.role === "owner";

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


  useEffect(() => {
    loadPage();
  }, []);


  async function loadPage() {
    try {
      setLoading(true);

      if (!isOwner) {
        const report =
          await dailyReportsService.getTodayReport();

        setReportId(report.id);
      }

      const data =
        await udhaarService.getUdhaar();

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

      setEntries([]);

    } finally {
      setLoading(false);
    }
  }


  async function addUdhaar(entries) {
    try {
      await udhaarService.createUdhaar(
        reportId,
        entries
      );

      setShowAdd(false);

      await loadPage();

    } catch (err) {
      console.error(
        "Failed to add Udhaar:",
        err
      );

      throw err;
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

      throw err;
    }
  }


  return (
    <div className="w-full">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden lg:block space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Udhaar
            </h1>

            <p className="mt-1 text-gray-500">
              Manage customer credit.
            </p>

          </div>

          {!isOwner && (
            <button
              onClick={() =>
                setShowAdd(true)
              }
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
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

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden w-full min-h-screen bg-gray-50 pb-24 overflow-x-hidden">

        {/* Header */}

        <div className="w-full bg-white border-b px-5 pt-6 pb-5">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <h1 className="text-3xl font-bold text-gray-900">
                Udhaar
              </h1>

              <p className="mt-1 text-gray-500">
                Manage customer credit.
              </p>

            </div>

            {!isOwner && (
              <button
                onClick={() =>
                  setShowAdd(true)
                }
                className="shrink-0 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Add Udhaar
              </button>
            )}

          </div>

        </div>


        {/* Content */}

        <div className="px-4 pt-5 space-y-4">

          {/* Udhaar Stats */}

          <UdhaarKPIs
            entries={entries}
          />


          {/* Udhaar List */}

          {loading ? (

            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
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

        </div>

      </div>


      {/* =====================================================
          ADD UDHAAR MODAL
      ===================================================== */}

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


      {/* =====================================================
          REPAY MODAL
      ===================================================== */}

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