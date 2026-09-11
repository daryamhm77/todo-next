import { redirect } from "next/navigation";
import SigninPage from "@/template/SigninPage";
import { getSession } from "@/utils/session";

export default async function Signin() {
  const session = await getSession();
  if (session) redirect("/");
  return <SigninPage />;
}
