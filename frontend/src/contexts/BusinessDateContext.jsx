import { createContext, useContext, useEffect, useState } from "react";

const BusinessDateContext = createContext(null);

const STORAGE_KEY = "pharmacore360_selected_report_date";

function getTodayIST() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function getInitialDate() {
  const savedDate = localStorage.getItem(STORAGE_KEY);

  return savedDate || getTodayIST();
}

export function BusinessDateProvider({ children }) {
  const [selectedDate, setSelectedDate] =
    useState(getInitialDate);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      selectedDate
    );
  }, [selectedDate]);

  function changeBusinessDate(date) {
    if (!date) return;

    setSelectedDate(date);

    localStorage.setItem(
      STORAGE_KEY,
      date
    );
  }

  return (
    <BusinessDateContext.Provider
      value={{
        selectedDate,
        setSelectedDate: changeBusinessDate,
      }}
    >
      {children}
    </BusinessDateContext.Provider>
  );
}

export function useBusinessDate() {
  const context = useContext(
    BusinessDateContext
  );

  if (!context) {
    throw new Error(
      "useBusinessDate must be used inside BusinessDateProvider"
    );
  }

  return context;
}