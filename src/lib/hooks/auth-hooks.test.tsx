import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: useSessionMock,
  },
}));

import { useAuthSession } from "./auth-hooks";

function AuthState() {
  const { isPending, isSignedIn } = useAuthSession();

  if (isPending) return <p>Loading</p>;
  return <p>{isSignedIn ? "Signed in" : "Signed out"}</p>;
}

describe("useAuthSession", () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({
      data: null,
      isPending: false,
    });
  });

  it("uses a stable pending state until hydration completes", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<AuthState />);
    const recoverableErrors: unknown[] = [];
    let root: Root | undefined;

    expect(container.textContent).toBe("Loading");

    await act(async () => {
      root = hydrateRoot(container, <AuthState />, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
    });

    expect(container.textContent).toBe("Signed out");
    expect(recoverableErrors).toEqual([]);

    await act(async () => {
      root?.unmount();
    });
  });
});
