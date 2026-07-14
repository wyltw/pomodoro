import { Button } from "./ui/button";
import { ChartColumn, Settings } from "lucide-react";
import { LoginDialog } from "@/components/auth/login-dialog";

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
          <Button variant={"ghost"} size={"lg"}>
            <ChartColumn data-icon="inline-start" />
            Statistics
          </Button>
        </li>
        <li>
          <LoginDialog />
        </li>
      </ul>
    </div>
  );
}
