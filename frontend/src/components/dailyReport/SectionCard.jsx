import { ChevronDown } from "lucide-react";

export default function SectionCard({
  title,
  children,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      <div className="flex justify-between items-center px-6 py-5 border-b">

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <ChevronDown
          size={20}
          className="text-gray-500"
        />

      </div>

      <div className="p-6">

        {children}

      </div>

    </div>
  );
}