"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { todayKey } from "@/utils/dates";

const DayContext = createContext(null);

function DayProvider({ children }) {
  const [selectedDay, setSelectedDay] = useState(todayKey);

  const value = useMemo(
    () => ({ selectedDay, setSelectedDay }),
    [selectedDay]
  );

  return <DayContext.Provider value={value}>{children}</DayContext.Provider>;
}

function useSelectedDay() {
  const context = useContext(DayContext);
  if (!context) {
    throw new Error("useSelectedDay must be used within DayProvider");
  }
  return context;
}

export { DayProvider, useSelectedDay };
