import Footer from "@/components/footer";
import Header from "@/components/header";
import React, { ReactNode } from "react";

type HomeLayoutProps = { children: ReactNode };
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto grid flex-1 justify-items-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
