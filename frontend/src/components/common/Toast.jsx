export default function Toast({ message, type = "error" }) {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-2">

      <div
        className={`rounded-xl px-5 py-3 shadow-lg text-white font-medium
        ${
          type === "error"
            ? "bg-red-600"
            : "bg-green-600"
        }`}
      >
        {message}
      </div>

    </div>
  );
}