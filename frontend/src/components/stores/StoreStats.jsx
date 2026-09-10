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
    <div
      className="
        grid
        w-full
        min-w-0
        grid-cols-3
        gap-2.5
        lg:gap-6
      "
    >

      {cards.map((card) => (
        <div
          key={card.title}
          className="
            min-w-0
            rounded-2xl
            border
            border-gray-200
            bg-white
            px-3.5
            py-5
            shadow-sm
            lg:p-6
          "
        >

          <p
            className="
              truncate
              text-[12px]
              font-medium
              leading-5
              text-gray-500
              lg:text-base
            "
          >
            {card.title}
          </p>

          <h2
            className="
              mt-1.5
              text-[24px]
              font-semibold
              leading-tight
              tracking-tight
              text-[#0F172A]
              lg:mt-3
              lg:text-4xl
              lg:font-bold
            "
          >
            {card.value}
          </h2>

        </div>
      ))}

    </div>
  );
}