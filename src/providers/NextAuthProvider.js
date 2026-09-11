"use client";

import { SessionProvider } from "next-auth/react";

function NextAuthProvider({ session, children }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default NextAuthProvider;
