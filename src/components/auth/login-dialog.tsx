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
import { Separator } from "@/components/ui/separator";
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
          <DialogDescription>Choose a provider to continue.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">Spotify</p>
              <span className="rounded-full bg-[#1ed760]/15 px-2 py-0.5 text-xs font-medium text-[#16883d] dark:text-[#1ed760]">
                Recommended
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Sign in with Spotify to enable full-track playback.
            </p>
          </div>
          <SocialLoginButton provider="spotify" callbackURL={callbackURL} />
          <Separator className="my-1" />
          <SocialLoginButton provider="google" callbackURL={callbackURL} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
