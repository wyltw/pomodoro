"use client";

import { SocialLoginButton } from "@/components/auth/social-login-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type LoginDialogProps = { children?: ReactNode; from?: "statistics" };

export function LoginDialog({ children, from }: LoginDialogProps) {
  const callbackURL = from ? `/${from}` : undefined;
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="link" size="lg">
            Sign in
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to Pomodoro</DialogTitle>
          <DialogDescription>
            Sign in to sync your focus tasks and track your progress.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          {/* <SocialLoginButton provider="spotify" callbackURL={callbackURL} /> */}
          <SocialLoginButton provider="google" callbackURL={callbackURL} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
