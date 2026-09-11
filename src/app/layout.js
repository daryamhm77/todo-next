import { Suspense } from "react";
import NextAuthProvider from "@/providers/NextAuthProvider";
import AppShell from "@/layout/AppShell";
import ShellFallback from "@/layout/ShellFallback";
import { displayFont } from "@/utils/fonts";
import { getSession } from "@/utils/session";
import "./globals.css";

export const metadata = {
  title: "To-Do List",
  description: "A simple to-do list",
};

async function AuthenticatedApp({ children }) {
  const session = await getSession();

  return (
    <NextAuthProvider session={session}>
      <AppShell>{children}</AppShell>
    </NextAuthProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={displayFont.className}>
        <Suspense fallback={<ShellFallback />}>
          <AuthenticatedApp>{children}</AuthenticatedApp>
        </Suspense>
      </body>
    </html>
  );
}
