function ShellFallback() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <span className="brand">To-Do List</span>
      </header>
      <div className="sheet-main">
        <div className="todo-board">
          <div className="todo-table-wrap">
            <div className="todo-head">
              <span>Due date</span>
              <span>Priority</span>
              <span>What</span>
              <span>Who</span>
              <span>In progress</span>
              <span>Done</span>
            </div>
            <div className="empty-row">Loading…</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShellFallback;
