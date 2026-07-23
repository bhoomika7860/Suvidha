export default function StoreStats({ stores }) {
  const total = stores.length;

  const active = stores.filter(
    (s) => s.is_active
  ).length;

  const inactive = total - active;

  const cards = [
    {
      title: "Total Stores",
      value: total,
    },
    {
      title: "Active Stores",
      value: active,
    },
    {
      title: "Inactive Stores",
      value: inactive,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
        >

          <p className="text-gray-500">
            {card.title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {card.value}
          </h2>

        </div>

      ))}

    </div>
  );
}