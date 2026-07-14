import { Settings } from "lucide-react";

import { AuthMenu } from "@/components/auth/auth-menu";
import { StatisticsButton } from "@/components/statistics/statistics-button";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="flex h-12 items-center justify-end px-4">
      <h1>POMODORO</h1>
      <ul className="ms-auto flex gap-2">
        <li className="">
          <Button variant={"ghost"} size={"lg"}>
            <Settings data-icon="inline-start" />
            Settings
          </Button>
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
