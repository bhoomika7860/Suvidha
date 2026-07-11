const products = [
  "Dolo 650",
  "Shelcal 500",
  "Augmentin 625",
];

export default function BouncedProducts() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Today's Bounced Products
      </h2>

      <div className="space-y-3">

        {products.map((product) => (
          <div
            key={product}
            className="flex items-center justify-between border-b pb-3"
          >
            <span>{product}</span>

            <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
              Out of Stock
            </span>

          </div>
        ))}

      </div>

      <div className="flex justify-between mt-8">

        <span className="font-semibold">
          Total
        </span>

        <span className="text-2xl font-bold text-red-600">
          3
        </span>

      </div>

    </div>
  );
}