"use client";

import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import { DayProvider } from "@/providers/DayProvider";
import WeekStrip from "@/module/WeekStrip";
import AppFooter from "@/module/AppFooter";
import AuthModal from "@/module/AuthModal";

function AppShell({ children }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  return (
    <DayProvider>
      <div className="sheet">
        <header className="sheet-header">
          <Link href="/" className="brand">
            To-Do List
          </Link>
          {signedIn ? (
            <nav className="nav">
              <button type="button" onClick={() => signOut()}>
                Logout
              </button>
            </nav>
          ) : null}
        </header>
        {signedIn ? <WeekStrip /> : null}
        <div className="sheet-main">{children}</div>
        {signedIn ? <AppFooter /> : null}
      </div>
      {status === "unauthenticated" ? <AuthModal /> : null}
      <Toaster />
    </DayProvider>
  );
}

export default AppShell;
