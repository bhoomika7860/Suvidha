export default function UdhaarKPIs({ entries }) {
  const totalOutstanding = entries.reduce(
    (sum, entry) => sum + (entry.amount - entry.paid_amount),
    0
  );

  const totalCustomers = entries.length;

  const totalGiven = entries.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  const totalRecovered = entries.reduce(
    (sum, entry) => sum + entry.paid_amount,
    0
  );

  const cards = [
    {
      title: "Outstanding",
      value: `₹${totalOutstanding.toLocaleString()}`,
    },
    {
      title: "Customers",
      value: totalCustomers,
    },
    {
      title: "Total Given",
      value: `₹${totalGiven.toLocaleString()}`,
    },
    {
      title: "Recovered",
      value: `₹${totalRecovered.toLocaleString()}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}