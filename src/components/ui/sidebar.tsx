"use client";

import * as React from "react";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type SidebarContextValue = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined,
);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const value = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      toggleSidebar: () => setIsOpen((current) => !current),
    }),
    [isOpen],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        data-state={isOpen ? "expanded" : "collapsed"}
        className={cn("flex min-h-0 flex-1", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  const { isOpen } = useSidebar();

  return (
    <aside
      data-slot="sidebar"
      data-state={isOpen ? "expanded" : "collapsed"}
      className={cn(
        "group/sidebar bg-sidebar text-sidebar-foreground flex w-72 shrink-0 flex-col border-r border-sidebar-border transition-[width] duration-200 ease-out data-[state=collapsed]:w-14",
        className,
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex items-center gap-2 p-3", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4 group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto p-3 group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="sidebar-group"
      className={cn("space-y-3", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sidebar-group-label"
      className={cn("font-heading text-sm font-medium", className)}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  );
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { isOpen, toggleSidebar } = useSidebar();
  const Icon = isOpen ? PanelLeftCloseIcon : PanelLeftOpenIcon;

  return (
    <Button
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      className={className}
      onClick={toggleSidebar}
      size="icon"
      title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      type="button"
      variant="ghost"
      {...props}
    >
      <Icon />
    </Button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
