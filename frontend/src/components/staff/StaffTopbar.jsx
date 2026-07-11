export default function StaffTopbar() {
  return (
    <header className="h-24 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold">
          Sector 7 Pharmacy
        </h1>

        <p className="text-gray-500 mt-1">
          Staff Portal
        </p>

      </div>

      <div className="text-right">

        <p className="font-semibold">
          Rahul Sharma
        </p>

        <p className="text-gray-500 text-sm">
          Staff
        </p>

      </div>

    </header>
  );
}