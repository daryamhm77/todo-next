import { redirect } from "next/navigation";
import CalendarPage from "@/template/CalendarPage";
import { getSession } from "@/utils/session";
import { getTodoBoard } from "@/utils/user";

export default async function Calendar() {
  const session = await getSession();
  if (!session) redirect("/");

  const { todos } = await getTodoBoard();
  return <CalendarPage initialTodos={todos} />;
}
