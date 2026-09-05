import { CalendarDays } from "lucide-react";
import { useBusinessDate } from "../../contexts/BusinessDateContext";

export default function MobileBusinessDate() {
  const {
    selectedDate,
    setSelectedDate,
  } = useBusinessDate();

  const businessDate = new Date(
    `${selectedDate}T12:00:00`
  );

  const formattedDate =
    businessDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  return (
    <div className="border-b border-gray-200 bg-white px-5 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays
            size={16}
            className="shrink-0 text-blue-600"
          />

          <span className="text-xs font-medium text-gray-500">
            Business Date
          </span>

          <span className="truncate text-xs font-semibold text-gray-900">
            {formattedDate}
          </span>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
          className="h-8 w-[125px] shrink-0 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-900 outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}