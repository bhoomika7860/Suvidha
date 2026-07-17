import { useEffect, useState } from "react";
import api from "../../api/api";

export default function HeroCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

      <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
        Staff Dashboard
      </p>

      <h1 className="text-4xl font-bold mt-2">
        Good Evening, {user?.full_name || "Staff"} 👋
      </h1>

      <p className="text-gray-500 mt-3 text-lg">
        Here's everything assigned to you today.
      </p>

    </div>
  );
}