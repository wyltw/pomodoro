import Footer from "@/components/footer";
import Header from "@/components/header";
import React, { ReactNode } from "react";
type LayoutProps = { children: ReactNode };
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto grid flex-1 grid-rows-[min-content_1fr] items-center justify-items-center gap-4 px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
