import { toDateKey, todayKey, weekDates, monthBounds } from "./dates";

function tally(todos) {
  const result = { total: todos.length, done: 0, inProgress: 0, todo: 0 };
  for (const item of todos) {
    if (item.status === "done") result.done += 1;
    else if (item.status === "inProgress" || item.status === "review") {
      result.inProgress += 1;
    } else {
      result.todo += 1;
    }
  }
  return result;
}

function inRange(todos, start, end) {
  return todos.filter((item) => {
    const key = toDateKey(item.dueDate);
    return key && key >= start && key <= end;
  });
}

function profileStats(todos = [], now = new Date()) {
  const today = toDateKey(now) || todayKey();
  const week = weekDates(today);
  const weekStart = toDateKey(week[0]);
  const weekEnd = toDateKey(week[6]);
  const month = monthBounds(today);
  const weekTodos = inRange(todos, weekStart, weekEnd);
  const monthTodos = inRange(todos, month.start, month.end);

  return {
    week: {
      ...tally(weekTodos),
      start: weekStart,
      end: weekEnd,
      days: week.map((date) => {
        const key = toDateKey(date);
        const dayTodos = weekTodos.filter((item) => toDateKey(item.dueDate) === key);
        return {
          key,
          label: date.toLocaleString("en-US", { weekday: "short" }),
          ...tally(dayTodos),
        };
      }),
    },
    month: {
      ...tally(monthTodos),
      start: month.start,
      end: month.end,
      label: month.label,
    },
  };
}

export { profileStats, tally };
