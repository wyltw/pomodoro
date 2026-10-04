"use client";

import { useState } from "react";

import { GoogleIcon, SpotifyIcon } from "@/components/auth/provider-icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { retry } from "@/lib/utils/utils";

type SocialProvider = "google" | "spotify";

type SocialLoginButtonProps = {
  provider: SocialProvider;
  callbackURL?: string;
};

export function SocialLoginButton({
  provider,
  callbackURL,
}: SocialLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const isSpotify = provider === "spotify";
  const providerName = isSpotify ? "Spotify" : "Google";
  const ProviderIcon = isSpotify ? SpotifyIcon : GoogleIcon;

  async function handleSignIn() {
    setErrorText(null);
    setIsPending(true);
    const signIn = () => {
      return authClient.signIn.social({
        provider,
        callbackURL,
      });
    };

    const result = await retry({
      action: signIn,
      shouldRetry: (result) =>
        result.error != null && result.error?.status >= 500,
    });

    if (result.error) {
      setErrorText(
        result.error.message ?? `Unable to sign in with ${providerName}.`,
      );
    }
    setIsPending(false);
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
      {errorText && (
        <p className="text-destructive text-sm" role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
}
