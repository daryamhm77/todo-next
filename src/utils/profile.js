import { profileStats } from "@/utils/stats";
import { serializeTodos } from "@/utils/todos";

function publicProfile(user) {
  const todos = user?.todos || [];
  return {
    name: user?.name || "",
    lastName: user?.lastName || "",
    email: (user?.email || "").toLowerCase(),
    stats: profileStats(todos),
  };
}

function todoBoard(user) {
  if (!user) return { todos: [], notes: "" };
  return {
    todos: serializeTodos(user.todos),
    notes: user.notes || "",
  };
}

export { publicProfile, todoBoard };
