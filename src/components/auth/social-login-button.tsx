"use client";

import { useState } from "react";

import { GoogleIcon, SpotifyIcon } from "@/components/auth/provider-icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type SocialProvider = "google" | "spotify";

type SocialLoginButtonProps = {
  provider: SocialProvider;
};

export function SocialLoginButton({ provider }: SocialLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSpotify = provider === "spotify";
  const providerName = isSpotify ? "Spotify" : "Google";
  const ProviderIcon = isSpotify ? SpotifyIcon : GoogleIcon;

  async function handleSignIn() {
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signIn.social({ provider });

      if (result.error) {
        setError(
          result.error.message ?? `Unable to sign in with ${providerName}.`,
        );
      }
    } catch {
      setError(`Unable to sign in with ${providerName}.`);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={isPending}
        onClick={() => void handleSignIn()}
      >
        <ProviderIcon
          className={isSpotify ? "text-[#1ed760]" : "text-[#4285f4]"}
          data-icon="inline-start"
        />
        {isPending
          ? `Redirecting to ${providerName}...`
          : `Continue with ${providerName}`}
      </Button>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
