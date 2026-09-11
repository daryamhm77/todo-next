import HomePage from "@/template/HomePage";
import { getSession } from "@/utils/session";
import { getTodoBoard } from "@/utils/user";

export default async function Home() {
  const session = await getSession();
  const board = session ? await getTodoBoard() : { todos: [], notes: "" };

  return (
    <HomePage
      initialTodos={board.todos}
      initialNotes={board.notes}
      signedIn={Boolean(session)}
    />
  );
}
