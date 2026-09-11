"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function AddTodoPage({ date = "" }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [who, setWho] = useState("");
  const [dueDate, setDueDate] = useState(date);
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const addHandler = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Add a task name.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        who: who.trim(),
        dueDate,
        priority,
        status: "todo",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);

    if (data.status === "success") {
      toast.success("Task added");
      setTitle("");
      setWho("");
      setDueDate("");
      setPriority("medium");
      router.push(date ? "/calendar" : "/");
      router.refresh();
    } else {
      toast.error(data.error || "Could not add task");
    }
  };

  return (
    <form className="add-form" onSubmit={addHandler}>
      <h2>Add task</h2>
      <div className="fields">
        <div className="field">
          <label htmlFor="title">What</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Renew vehicle registration"
          />
        </div>
        <div className="field">
          <label htmlFor="who">Who</label>
          <input
            id="who"
            type="text"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            placeholder="DMV"
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Priority</label>
            <div className="priority-options">
              {["high", "medium", "low"].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={priority === value}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <span className={`dot ${value}`} />
                  {value}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}

export default AddTodoPage;
