import type { Metadata } from "next";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Focus Statistics",
  description:
    "Review your completed Pomodoro sessions from the last seven days.",
};

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <ReactQueryProvider>
      <Header />
      <main className="container mx-auto grid flex-1 grid-rows-[min-content_1fr] items-center justify-items-center gap-4 px-4">
        {children}
      </main>
      <Footer />
    </ReactQueryProvider>
  );
}
