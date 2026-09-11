"use client";

import Link from "next/link";
import { FiCalendar } from "react-icons/fi";
import { useSelectedDay } from "@/providers/DayProvider";
import { toDateKey, weekDates } from "@/utils/dates";

function WeekStrip() {
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const days = weekDates(selectedDay);

  return (
    <div className="week-strip">
      {days.map((date) => {
        const key = toDateKey(date);
        const label = date.toLocaleString("en-US", { weekday: "short" });
        const active = key === selectedDay;

        return (
          <button
            key={key}
            type="button"
            className={`week-day${active ? " is-active" : ""}`}
            onClick={() => setSelectedDay(key)}
            aria-pressed={active}
            aria-label={date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          >
            {label}
          </button>
        );
      })}
      <Link href="/calendar" className="week-day week-cal" aria-label="Open calendar">
        <FiCalendar />
      </Link>
    </div>
  );
}

export default WeekStrip;
