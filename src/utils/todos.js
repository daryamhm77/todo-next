import { toDateKey } from "@/utils/dates";

function serializeTodo(todo) {
  return {
    _id: String(todo._id),
    title: todo.title,
    status: todo.status || "todo",
    who: todo.who || "",
    dueDate: todo.dueDate || "",
    priority: todo.priority || "medium",
  };
}

function serializeTodos(todos = []) {
  return todos.map(serializeTodo);
}

function groupTodosByDate(todos = []) {
  const groups = {};
  const undated = [];

  for (const todo of todos) {
    const key = toDateKey(todo.dueDate);
    if (!key) {
      undated.push(todo);
      continue;
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(todo);
  }

  return { groups, undated };
}

function monthDays(year, month) {
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => new Date(year, month, index + 1));
}

export { serializeTodo, serializeTodos, groupTodosByDate, monthDays };
