"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Tasks from "../module/Tasks";
import { useSelectedDay } from "@/providers/DayProvider";
import { toDateKey } from "@/utils/dates";

function HomePage({ initialTodos = [], initialNotes = "", signedIn = false }) {
  const router = useRouter();
  const { selectedDay } = useSelectedDay();
  const [notes, setNotes] = useState(initialNotes);
  const [todos, setTodos] = useOptimistic(
    initialTodos,
    (current, { id, status }) =>
      current.map((todo) =>
        String(todo._id) === String(id) ? { ...todo, status } : todo
      )
  );
  const [, startTransition] = useTransition();

  const visibleTodos = useMemo(
    () => todos.filter((todo) => toDateKey(todo.dueDate) === selectedDay),
    [todos, selectedDay]
  );

  const saveNotes = async () => {
    if (!signedIn) return;
    await fetch("/api/todo", {
      method: "PATCH",
      body: JSON.stringify({ notes }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const changeStatus = (id, status) => {
    startTransition(async () => {
      setTodos({ id, status });
      const res = await fetch("/api/todo", {
        method: "PATCH",
        body: JSON.stringify({ id, status }),
        headers: { "Content-Type": "application/json" },
      });
      const payload = await res.json();
      if (payload.status !== "success") {
        router.refresh();
      }
    });
  };

  return (
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
        <Tasks
          data={visibleTodos}
          onStatusChange={signedIn ? changeStatus : undefined}
          emptyText="No tasks on this day."
        />
      </div>
      {signedIn ? (
        <section className="notes">
          <h2>Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="To get started right away, just tap any placeholder text (such as this) and start typing to replace it with your own."
          />
        </section>
      ) : null}
    </div>
  );
}

export default HomePage;
