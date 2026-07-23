import { AuthMenu } from "@/components/auth/auth-menu";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { StatisticsButton } from "@/components/statistics/statistics-button";

export default function Header() {
  return (
    <div className="flex h-12 items-center justify-end px-4">
      <h1>POMODORO</h1>
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
    </div>
  );
}
