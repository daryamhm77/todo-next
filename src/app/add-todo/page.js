import { redirect } from "next/navigation";
import AddTodoPage from "@/template/AddTodoPage";
import { getSession } from "@/utils/session";

export default async function AddTodo({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/");

  const params = await searchParams;
  return <AddTodoPage key={params?.date || "new"} date={params?.date || ""} />;
}
