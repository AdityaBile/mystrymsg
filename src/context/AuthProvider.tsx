"use client";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode; //NOTE -  type of children
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
