function toDateKey(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return toDateKey(new Date());
}

function weekDates(selectedKey) {
  const base = selectedKey ? new Date(`${selectedKey}T00:00:00`) : new Date();
  const weekday = base.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  const monday = new Date(base);
  monday.setDate(base.getDate() + offset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

function monthBounds(selectedKey) {
  const date = selectedKey ? new Date(`${selectedKey}T00:00:00`) : new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: toDateKey(start),
    end: toDateKey(end),
    label: start.toLocaleString("en-US", { month: "long", year: "numeric" }),
  };
}

export { toDateKey, todayKey, weekDates, monthBounds };
