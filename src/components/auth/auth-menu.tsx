"use client";

import { ChevronDown, LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { LoginDialog } from "@/components/auth/login-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useAuthSession } from "@/lib/hooks/auth-hooks";
import { getInitials } from "@/lib/utils/utils";

export function AuthMenu() {
  const { session, isPending } = useAuthSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message ?? "Unable to sign out.");
      }
    } catch {
      toast.error("Unable to sign out.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <Button variant="ghost" size="lg" disabled aria-label="Loading account">
        <LoaderCircle className="animate-spin" />
      </Button>
    );
  }

  if (!session) return <LoginDialog />;

  const { image, name } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="max-w-52">
          <Avatar size="sm">
            <AvatarImage src={image ?? undefined} alt="" />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{name}</span>
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          disabled={isSigningOut}
          onSelect={() => void handleSignOut()}
        >
          {isSigningOut ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <LogOut />
          )}
          {isSigningOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
