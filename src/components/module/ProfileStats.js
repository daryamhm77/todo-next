function percentDone(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function TrackCard({ title, subtitle, stats, children }) {
  const pct = percentDone(stats.done, stats.total);

  return (
    <section className="track-card">
      <div className="track-head">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="track-bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="track-counts">
        <span>{stats.done} done</span>
        <span>{stats.inProgress} in progress</span>
        <span>{stats.todo} to do</span>
      </div>
      {children}
    </section>
  );
}

function ProfileStats({ stats }) {
  if (!stats) return null;

  const weekLabel = stats.week.total
    ? `${stats.week.done} of ${stats.week.total} done`
    : "No tasks this week";
  const monthLabel = stats.month.total
    ? `${stats.month.done} of ${stats.month.total} done`
    : "No tasks this month";

  return (
    <div className="track-grid">
      <TrackCard title="This week" subtitle={weekLabel} stats={stats.week}>
        <div className="track-days">
          {stats.week.days.map((day) => {
            const complete = day.total > 0 && day.done === day.total;
            const empty = day.total === 0;
            return (
              <div
                key={day.key}
                className={`track-day${complete ? " is-complete" : ""}${empty ? " is-empty" : ""}`}
              >
                <span>{day.label.slice(0, 2)}</span>
                <strong>{day.done}/{day.total || 0}</strong>
              </div>
            );
          })}
        </div>
      </TrackCard>
      <TrackCard
        title="This month"
        subtitle={stats.month.label ? `${stats.month.label} · ${monthLabel}` : monthLabel}
        stats={stats.month}
      />
    </div>
  );
}

export default ProfileStats;
