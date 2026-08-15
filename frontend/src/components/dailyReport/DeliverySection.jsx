import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Truck,
} from "lucide-react";

import SectionCard from "./SectionCard";
import dailyReportsService from "../../services/dailyReportsService";

const NUMBER_INPUT_CLASS =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function handleNumberWheel(e) {
  e.currentTarget.blur();
}

const DeliverySection = forwardRef(
  function DeliverySection(
    {
      report,
      refreshReport,
    },
    ref
  ) {
    const [deliveries, setDeliveries] =
      useState("");

    useEffect(() => {
      if (!report) {
        setDeliveries("");
        return;
      }

      /*
       * Keep the input empty when the
       * saved value is 0.
       *
       * If a value has already been saved,
       * load that value back into the field.
       *
       * This means refreshing the page does
       * not make saved values disappear.
       */
      const value =
        Number(
          report.deliveries || 0
        );

      setDeliveries(
        value > 0
          ? String(value)
          : ""
      );
    }, [report]);

    async function handleSave() {
      if (
        !report ||
        report.is_locked
      ) {
        return;
      }

      const value =
        Number(
          deliveries || 0
        );

      if (value < 0) {
        throw new Error(
          "Deliveries cannot be negative."
        );
      }

      await dailyReportsService.updateDeliveries(
        report.id,
        value
      );

      await refreshReport();
    }

    useImperativeHandle(
      ref,
      () => ({
        save: handleSave,
      }),
      [
        report,
        deliveries,
        refreshReport,
      ]
    );

    if (!report) {
      return null;
    }

    return (
      <SectionCard title="Deliveries">

        <div className="space-y-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">

              <Truck
                size={18}
                className="text-violet-600"
              />

            </div>

            <div>

              <h3 className="text-base font-semibold text-gray-900">
                Deliveries
              </h3>

              <p className="text-sm text-gray-500">
                Record deliveries completed today.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="rounded-xl border border-gray-200 bg-white p-5">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Total Deliveries
              </label>

              <input
                type="number"
                min="0"
                value={deliveries}
                disabled={
                  report.is_locked
                }
                onChange={(e) =>
                  setDeliveries(
                    e.target.value
                  )
                }
                onWheel={
                  handleNumberWheel
                }
                className={`${NUMBER_INPUT_CLASS} h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100`}
              />

            </div>


            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Deliveries Completed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-violet-600">
                {Number(
                  deliveries || 0
                )}
              </h2>

            </div>

          </div>

        </div>

      </SectionCard>
    );
  }
);

export default DeliverySection;