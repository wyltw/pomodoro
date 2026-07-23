import { FocusTaskSidebar } from "@/components/focus-task/focus-task-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TimerStatusProvider } from "@/lib/contexts/timer-status-context";
import { AppProvider } from "@/lib/stores/daily-focus-tasks-store";
import { ReactNode } from "react";
import { Toaster } from "sonner";

type HomeLayoutProps = { children: ReactNode };
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <AppProvider>
      <TimerStatusProvider>
        <SidebarProvider>
          <FocusTaskSidebar />
          <SidebarInset>
            <Header showSidebarTrigger />
            <div className="container mx-auto grid flex-1 grid-rows-[min-content_1fr] items-center justify-items-center gap-4 px-4">
              {children}
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </TimerStatusProvider>
      <Toaster />
    </AppProvider>
  );
}
