import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContinueButton() {

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/manager/daily-report")}
      className="
      w-52
      h-10
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      text-[13px]
      font-medium
      flex
      items-center
      justify-center
      gap-2
      transition
      "
    >
      Continue Today's Report
      <ArrowRight size={14} />
    </button>
  );
}