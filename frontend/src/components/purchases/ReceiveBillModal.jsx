import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";



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



export default function ReceiveBillModal({
  isOpen,
  onClose,
  onSave,
  reportId,
}) {
  const [purchaseDate, setPurchaseDate] = useState("");
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [billNo, setBillNo] = useState("");
  const [billImage, setBillImage] = useState(null);


const [showSuggestions, setShowSuggestions] =
  useState(false);

const [highlightedIndex, setHighlightedIndex] =
  useState(-1);

const suggestionRefs = useRef([]);

const filteredSuppliers = SUPPLIERS.filter(
  (supplier) =>
    supplier
      .toLowerCase()
      .includes(party.toLowerCase())
).slice(0, 8);

  const modalRef = useRef(null);


  useEffect(() => {
  if (isOpen) {
    const today = new Date()
      .toLocaleDateString("en-CA");

    setPurchaseDate(today);
  }
}, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen, onClose]);


  useEffect(() => {
  if (
    highlightedIndex >= 0 &&
    suggestionRefs.current[highlightedIndex]
  ) {
    suggestionRefs.current[
      highlightedIndex
    ].scrollIntoView({
      block: "nearest",
    });
  }
}, [highlightedIndex]);

  if (!isOpen) return null;



function selectSupplier(supplier) {
  setParty(supplier);

  setShowSuggestions(false);

  setHighlightedIndex(-1);
}


function handleKeyDown(e) {
  if (!showSuggestions) return;

  switch (e.key) {

    case "ArrowDown":
      e.preventDefault();

      setHighlightedIndex((prev) =>
        prev < filteredSuppliers.length - 1
          ? prev + 1
          : 0
      );

      break;

    case "ArrowUp":
      e.preventDefault();

      setHighlightedIndex((prev) =>
        prev > 0
          ? prev - 1
          : filteredSuppliers.length - 1
      );

      break;

    case "Enter":
      e.preventDefault();

      if (highlightedIndex >= 0) {
        selectSupplier(
          filteredSuppliers[
            highlightedIndex
          ]
        );
      }

      break;

    case "Escape":
      setShowSuggestions(false);
      break;

    default:
      break;
  }
}

  function handleSubmit() {
    if (
  !party ||
  !amount ||
  !billNo
) {
  return;
}

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    onSave({
      store_id: user.store_id,
      daily_report_id: reportId,
      product_name: "Purchase Bill",
      quantity: 1,
      supplier_name: party,
      purchase_amount: Number(amount),
      created_by: user.user_id,
      bill_number: billNo,
      received_by: user.full_name,
      entered_by: "",
      status: "received",
      purchase_date: purchaseDate,
      bill_image: billImage,
    });

    setParty("");
    setAmount("");
    setBillNo("");
    setPurchaseDate("");
    setBillImage(null);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        ref={modalRef}
        className="w-[650px] rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Receive Purchase Bill
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-5 p-6">


          <div className="relative">

  <label className="mb-2 block text-sm font-medium">
    Supplier
  </label>

  <input
    value={party}
    placeholder="Search Supplier..."
    className="h-11 w-full rounded-xl border border-gray-200 px-4"
    onFocus={() => {
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    }}
    onChange={(e) => {
      setParty(e.target.value);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    }}
    onKeyDown={handleKeyDown}
  />

  {showSuggestions &&
    filteredSuppliers.length > 0 && (

      <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-lg max-h-64 overflow-y-auto">

        {filteredSuppliers.map((supplier, index) => (

          <button
            key={supplier}
            ref={(el) =>
              suggestionRefs.current[index] = el
            }
            type="button"
            onClick={() =>
              selectSupplier(supplier)
            }
            className={`w-full text-left px-4 py-3 ${
              highlightedIndex === index
                ? "bg-blue-100"
                : "hover:bg-blue-50"
            }`}
          >
            {supplier}
          </button>

        ))}

      </div>

    )}

</div>

          <div>
  <label className="mb-2 block text-sm font-medium">
    Purchase Date
  </label>

  <input
    type="date"
    value={purchaseDate}
    onChange={(e) =>
      setPurchaseDate(e.target.value)
    }
    className="h-11 w-full rounded-xl border border-gray-200 px-4"
  />
</div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              placeholder="Enter Purchase Amount"
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bill Number
            </label>

            <input
              value={billNo}
              onChange={(e) =>
                setBillNo(e.target.value)
              }
              placeholder="Enter Bill Number"
              className="h-11 w-full rounded-xl border border-gray-200 px-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Upload Bill
            </label>

            <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 transition hover:border-blue-500">
              {billImage ? (
                <img
                  src={URL.createObjectURL(billImage)}
                  alt="Bill"
                  className="h-full w-full rounded-2xl object-contain"
                />
              ) : (
                <>
                  <Upload
                    size={36}
                    className="text-gray-400"
                  />

                  <p className="mt-3 text-sm text-gray-500">
                    Click to upload bill image
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setBillImage(
                    e.target.files[0]
                  )
                }
              />
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="h-11 w-full rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            Submit Bill
          </button>
        </div>
      </div>
    </div>
  );
}