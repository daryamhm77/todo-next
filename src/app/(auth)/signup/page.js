import { redirect } from "next/navigation";
import SignupPage from "@/template/SignupPage";
import { getSession } from "@/utils/session";

export default async function Signup() {
  const session = await getSession();
  if (session) redirect("/");
  return <SignupPage />;
}
