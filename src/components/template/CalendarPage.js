"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { groupTodosByDate, monthDays } from "@/utils/todos";
import { toDateKey } from "@/utils/dates";
import { useSelectedDay } from "@/providers/DayProvider";

function statusLabel(status) {
  if (status === "done") return "Done";
  if (status === "inProgress" || status === "review") return "Doing";
  return "Todo";
}

function CalendarPage({ initialTodos = [] }) {
  const { selectedDay, setSelectedDay } = useSelectedDay();
  const selectedDate = new Date(`${selectedDay}T00:00:00`);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const { groups, undated } = useMemo(
    () => groupTodosByDate(initialTodos),
    [initialTodos]
  );
  const days = monthDays(year, month);
  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const node = document.getElementById(`day-${selectedDay}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedDay]);

  const shiftMonth = (amount) => {
    const date = new Date(year, month + amount, 1);
    setSelectedDay(toDateKey(date));
  };

  return (
    <div className="calendar">
      <div className="calendar-toolbar">
        <h2>Calendar</h2>
        <div className="calendar-nav">
          <button type="button" onClick={() => shiftMonth(-1)}>
            Prev
          </button>
          <span>{monthLabel}</span>
          <button type="button" onClick={() => shiftMonth(1)}>
            Next
          </button>
        </div>
      </div>

      {undated.length ? (
        <section className="calendar-day">
          <div className="calendar-num">—</div>
          <div className="calendar-meta">
            <span>No date</span>
            <span>Unscheduled</span>
          </div>
          <div className="calendar-items">
            {undated.map((todo) => (
              <div
                key={todo._id}
                className={`calendar-item${todo.status === "done" ? " is-done" : ""}`}
              >
                <span className="tag">{statusLabel(todo.status)}</span>
                <span className="title">{todo.title}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {days.map((date) => {
        const key = toDateKey(date);
        const items = groups[key] || [];
        const isSelected = key === selectedDay;
        const isEmpty = items.length === 0;

        return (
          <section
            id={`day-${key}`}
            key={key}
            className={`calendar-day${isSelected ? " is-today" : ""}${isEmpty ? " is-empty" : ""}`}
          >
            <button
              type="button"
              className="calendar-num"
              onClick={() => setSelectedDay(key)}
            >
              {date.getDate()}
            </button>
            <div className="calendar-meta">
              <span>{date.toLocaleString("en-US", { weekday: "long" })}</span>
              <span>{date.toLocaleString("en-US", { month: "long" })}</span>
              <Link href={`/todos?date=${key}`}>Add</Link>
            </div>
            {items.length ? (
              <div className="calendar-items">
                {items.map((todo) => (
                  <div
                    key={todo._id}
                    className={`calendar-item${todo.status === "done" ? " is-done" : ""}`}
                  >
                    <span className="tag">{statusLabel(todo.status)}</span>
                    <span className="title">{todo.title}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

export default CalendarPage;
