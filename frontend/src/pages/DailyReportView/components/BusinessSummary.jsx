export default function BusinessSummary() {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-semibold mb-4">Business Summary</h2>

      <ul className="list-disc pl-5 space-y-2 text-gray-600">
        <li>Sales increased compared to yesterday.</li>
        <li>Delivery completion remained high.</li>
        <li>A few bounced products require attention.</li>
        <li>Cash remains the dominant payment method.</li>
      </ul>
    </div>
  );
}