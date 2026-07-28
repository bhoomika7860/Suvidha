import Card from "./shared/Card";
import SectionHeader from "./shared/SectionHeader";

export default function DeliverySummary({
  deliveries = [],
}) {
  const total = deliveries.reduce(
    (sum, d) =>
      sum + d.deliveries_completed,
    0
  );

  return (
    <Card className="p-6">

      <SectionHeader
        title="Today's Deliveries"
        sub="Delivery performance"
      />

      <table className="w-full mt-5">

        <thead className="border-b">

          <tr>

            <th className="text-left py-3">
              Delivery Boy
            </th>

            <th className="text-right">
              Deliveries
            </th>

          </tr>

        </thead>

        <tbody>

          {deliveries.map((delivery) => (

            <tr
              key={delivery.id}
              className="border-b"
            >

              <td className="py-4">
                {delivery.delivery_boy_name}
              </td>

              <td className="text-right font-semibold">
                {delivery.deliveries_completed}
              </td>

            </tr>

          ))}

          <tr className="font-bold">

            <td className="pt-4">
              Total
            </td>

            <td className="text-right pt-4">
              {total}
            </td>

          </tr>

        </tbody>

      </table>

    </Card>
  );
}