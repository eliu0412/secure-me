'use client';
import { SessionProvider } from "next-auth/react";
import Head from "./components/head/page";


export default function Default() {
  return (
    <SessionProvider>
      <Head />
    </SessionProvider>
  );
}
