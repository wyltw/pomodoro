import Footer from "@/components/footer";
import { FocusTaskSidebar } from "@/components/focus-task-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

type HomeLayoutProps = { children: ReactNode };
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />
      <SidebarProvider>
        <FocusTaskSidebar />
        <SidebarInset>
          <main className="container mx-auto grid flex-1 grid-rows-[min-content_1fr] items-center justify-items-center gap-4 px-4">
            {children}
          </main>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
