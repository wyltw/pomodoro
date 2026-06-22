import Footer from "@/components/footer";
import Header from "@/components/header";
import React, { ReactNode } from "react";

type HomeLayoutProps = { children: ReactNode };
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto grid flex-1 grid-rows-[1fr_1fr] items-start justify-items-center gap-4 px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
