import { useState } from "react";
const SUPPLIERS = [
"AARBRO AGENCIES PRIVATE LIMITED",
"ABHAY MEDICAL HALL",
"ADITYA ENTERPRISES",
"ADLAKHA & SONS",
"AGGARWAL MEDIWAYS",
"AKLAVYA ENTERPRISES",
"AMAZON DISTRIBUTORS P LTD.",
"ANUGRAHITA ENTERPRISES PRIVATE LIMITED",
"AROSA BIOTECH PRIVATE LIMITED",
"AROWANA HEALTHCARE PRIVATE LIMITED",
"AUSGEN PHARMACEUTICALS",
"BALAJI PHARMA",
"BANTI PHARMA PRIVATE LIMITED",
"BESTIME TRADING COMPANY PRIVATE LIMITED",
"BHARTI DISTRIBUTORS",
"BHARTI MEDICAL AGENCIES",
"BIOSTEVE HEALTHCARE",
"BIOTECH (INDIA) PHARMACEUTICALS",
"CHANCHAL PHARMA",
"CHANDRASEKHRA PHARMA PVT LTD",
"CITY DISTRIBUTORS",
"D & D SALES AGENCY",
"D Y SURGICAL",
"D. C. AGENCIES PRIVATE LIMITED",
"DAANYA PHARMA PRIVATE LIMITED",
"DAPSON INDUSTRIES",
"DELHI PHARMA AGENCIES",
"DEV TRADING COMPANY",
"DOCXIS LIFE SCIENCES PRIVATE LIMITED",
"FARMAVIBE LLP",
"FBF ENTERPRISES",
"G.S TRADERS",
"GARG ENTERPRISES",
"GAYATRI ASSOCIATES",
"GAYATRI ENTERPRISES",
"GAYTRI ENTERPRISES",
"GLOBBUS INDIA",
"GOYAL TRADERS",
"GUPTA AGENCIES",
"GURU KRIPA SURGICAL",
"GURU KRIPA TRADERS",
"GURUNANAK DEV AGENCY",
"INSTANT SWIFT OVERSEAS PRIVATE LIMITED",
"J.R.SACHDEVA MARKETING",
"JAGGI ENTERPRISES PRIVATE LIMITED",
"JAI SHRI RAM TRADERS",
"JAICHANDA PHARMA",
"JAIN PAPERS",
"JATIN ENTERPRISES",
"JAYANTI MEDICAL AGENCY LLP",
"JMD ENTERPRISES",
"JOSHI PHARMA",
"K.D.SOLUTIONS",
"KAMINI ENTERPRISES",
"LAL SONS",
"LAXMI & COMPANY",
"LAXMI ENTERPRISES",
"LENITIVE ORGANICS",
"LEVIKAS ENTERPRISES PRIVATE LIMITED",
"LIFE CARE",
"LIFELINE PHARMA DISTRIBUTORS PRIVATE LIMITED",
"LIVEAID PHARMACEUTICALS",
"LUCKY PHARMA LOGISTICS PRIVATE LIMITED",
"M. K. ENTERPRISES",
"M.S MEDICOS",
"M/S SAVEX PHARMA",
"MEDIGLOBE PHARMA",
"MEDISAMY LLP",
"MEDISTE PHARMACEUTICAL PRIVATE LIMITED",
"MEDIWEST LIFE CARE PRIVATE LIMITED",
"METRO MARKETING",
"MUKUL COSMETICS",
"N KRISHNA PHARMACEUTICAL & RESEARCH CO",
"N.A.K. PHARMA",
"NAMAN PHARMACEUTICALS",
"NAM-ENT FMCG PRIVATE LIMITED",
"NARULA ASSOCIATES",
"NATIONAL UDYOG",
"NATURE PHARMA",
"NAVEEN ENTERPRISES",
"NAVYA BIOTECH",
"NEELKANTH PHARMA LOGISTICS PRIVATE LIMITED",
"NIRMAL AGENCIES",
"NUTRIX HEALTH CARE PVT LTD",
"OM AGENCIES",
"ORCHEM LABORATORIES",
"P.S. PHARMA",
"PHARMA CUBE",
"PHARMA DISTRIBUTORS",
"PHARMEX ENTERPRISES",
"POOJA TRADING COMPANY",
"PRESCRIPTION PHARMACY HO",
"QNT SPORT INDIA PRIVATE LIMITED",
"RAVI ENTERPRISES",
"REBELLION COSMETICS PRIVATE LIMITED",
"RESOURCE LIFESCIENCES",
"RIDHI SURGICAL",
"RS ENTERPRISES",
"S N PHARMA",
"S. N. ENTERPRISES",
"S.K. SALES",
"S.S. ENTERPRISES",
"SAI PHARMA",
"SAI RK PHARMA PRIVATE LIMITED",
"SAI TRADERS",
"SAVEX PHARMACEUTICALS",
"SAVIOUR AGENCIES PRIVATE LIMITED",
"SEHGAL MEDICAL AGENCIES",
"SHIV SHAKTI TRADING COMPANY",
"SHIV SHANKAR ENTERPRISES",
"SHREE SHYAM MEDIWAYS PRIVATE LIMITED",
"SHRI THAKRAN ENTERPRISES",
"SKINZYMES INNOVATION PRIVATE LIMITED",
"SL ENTERPRISES",
"SRS ENTERPRISES",
"SRS UNIFOODS CORP",
"SURGICAL WALA",
"V S HEALTHCARE",
"VARDHMAN ENTERPRISES",
"VIDKRIS RETAIL STORES PRIVATE LIMITED",
"VINAYAK ENTERPRISES",
"WALIA TRADERS",
"XYMERA BIOSCIENCE PRIVATE LIMITED",
"ZYDOVA HEALTHCARE PRIVATE LIMTED",
];
export default function CreatePurchaseOrderModal({
  open,
  onClose,
  onSave,
}) {

  const [order, setOrder] = useState({
    party: "",
    expectedAmount: "",
    expectedDate: "",
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  
  if (!open) return null;

  
const filteredSuppliers = SUPPLIERS.filter((supplier) =>
  supplier.toLowerCase().includes(order.party.toLowerCase())
).slice(0, 8);
  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Create Purchase Order
        </h2>

        <div className="relative">

  <input
    placeholder="Search Supplier..."
    className="w-full h-11 border rounded-xl px-4"
    value={order.party}
    onFocus={() => setShowSuggestions(true)}
    onChange={(e) => {
      setOrder({
        ...order,
        party: e.target.value,
      });
      setShowSuggestions(true);
    }}
  />

  {showSuggestions && filteredSuppliers.length > 0 && (
    <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-lg max-h-64 overflow-y-auto">

      {filteredSuppliers.map((supplier) => (

        <button
          key={supplier}
          type="button"
          onClick={() => {
            setOrder({
              ...order,
              party: supplier,
            });

            setShowSuggestions(false);
          }}
          className="w-full text-left px-4 py-3 hover:bg-blue-50"
        >
          {supplier}
        </button>

      ))}

    </div>
  )}

</div>

        <div className="flex justify-end gap-3 mt-6">
  <button
    onClick={onClose}
    className="px-5 py-2 rounded-xl border"
  >
    Cancel
  </button>

  <button
    onClick={() => {
      const user = JSON.parse(localStorage.getItem("user"));

      const orderData = {
        store_id: user.store_id,
        supplier_name: order.party,
        expected_amount: Number(order.expectedAmount),
        expected_date: order.expectedDate,
        created_by: user.user_id,
        items: [],
      };

      console.log("ORDER:", orderData);

      onSave(orderData);
    }}
    className="px-5 py-2 rounded-xl bg-blue-600 text-white"
  >
    Create Purchase Order
  </button>
</div>
      </div>

    </div>

  );

}