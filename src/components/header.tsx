import { AuthMenu } from "@/components/auth/auth-menu";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { StatisticsButton } from "@/components/statistics/statistics-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

type HeaderProps = {
  showSidebarTrigger?: boolean;
};

export default function Header({ showSidebarTrigger = false }: HeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center px-4">
      {showSidebarTrigger && <SidebarTrigger className="mr-2 md:hidden" />}
      <h1 className="font-heading font-semibold">POMODORO</h1>
      <ul className="ms-auto flex gap-2">
        <li>
          <SettingsDialog />
        </li>
        <li>
          <StatisticsButton />
        </li>
        <li>
          <AuthMenu />
        </li>
      </ul>
    </header>
  );
}
