"use client";

function CheckBox({ checked, onChange, label, disabled }) {
  return (
    <label className="check">
      <input
        className="check-box"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </label>
  );
}

function formatDueDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function Tasks({
  data,
  onStatusChange,
  emptyText = "No tasks yet. Add one to fill this list.",
}) {
  if (!data?.length) {
    return <div className="empty-row">{emptyText}</div>;
  }

  return (
    <div className="task-list">
      {data.map((todo) => {
        const priority = (todo.priority || "medium").toLowerCase();
        const inProgress =
          todo.status === "inProgress" ||
          todo.status === "review" ||
          todo.status === "done";
        const done = todo.status === "done";
        const canEdit = typeof onStatusChange === "function";

        return (
          <div key={todo._id} className="task-row">
            <div className="due">{formatDueDate(todo.dueDate)}</div>
            <div className="task-body">
              <div className="priority">
                <span className={`dot ${priority}`} />
                {priority}
              </div>
              <div className="what">{todo.title}</div>
              <div className="who">{todo.who || "—"}</div>
              <CheckBox
                label="In progress"
                checked={inProgress}
                disabled={!canEdit}
                onChange={() =>
                  onStatusChange(
                    todo._id,
                    todo.status === "inProgress" || todo.status === "review"
                      ? "todo"
                      : "inProgress"
                  )
                }
              />
              <CheckBox
                label="Done"
                checked={done}
                disabled={!canEdit}
                onChange={() =>
                  onStatusChange(todo._id, done ? "inProgress" : "done")
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Tasks;
