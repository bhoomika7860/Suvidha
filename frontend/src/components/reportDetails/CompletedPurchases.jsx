import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";

export default function CompletedPurchases({
  purchases = [],
}) {
  const totalPurchases = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.purchase_amount || 0),
    0
  );

  return (
    <Card className="p-6">
      <SectionHeader
        title="Completed Purchases"
        sub="Purchases included in today's report"
      />

      <div className="overflow-x-auto mt-5">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="py-3">Supplier</th>
              <th>Bill No.</th>
              <th>Amount</th>
              <th>Received By</th>
              <th>Checked By</th>
              <th>Entered By</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((purchase) => (
              <tr
                key={purchase.id}
                className="border-b"
              >
                <td className="py-4">
                  {purchase.supplier_name}
                </td>

                <td>
                  {purchase.bill_number}
                </td>

                <td>
                  ₹{Number(
                    purchase.purchase_amount
                  ).toLocaleString("en-IN")}
                </td>

                <td>
                  {purchase.received_by}
                </td>

                <td>
                  {purchase.checked_by}
                </td>

                <td>
                  {purchase.entered_by}
                </td>

                <td>
                  <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">
                    Completed
                  </span>
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="border-t font-bold">
              <td colSpan={2} className="py-4">
                Total
              </td>

              <td className="py-4">
                ₹{totalPurchases.toLocaleString("en-IN")}
              </td>

              <td colSpan={4}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}