import { describe, expect, it } from "vitest";

import { withExplicitPostgresSslMode } from "./postgres-url";

describe("withExplicitPostgresSslMode", () => {
  it.each(["prefer", "require", "verify-ca"])(
    "replaces sslmode=%s with verify-full",
    (sslMode) => {
      const connectionString = `postgresql://user:password@database.example.com/app?pooling=true&sslmode=${sslMode}`;

      expect(withExplicitPostgresSslMode(connectionString)).toBe(
        "postgresql://user:password@database.example.com/app?pooling=true&sslmode=verify-full",
      );
    },
  );

  it.each(["disable", "no-verify", "verify-full"])(
    "preserves sslmode=%s",
    (sslMode) => {
      const connectionString = `postgresql://user:password@database.example.com/app?sslmode=${sslMode}`;

      expect(withExplicitPostgresSslMode(connectionString)).toBe(
        connectionString,
      );
    },
  );

  it("preserves a connection string without an SSL mode", () => {
    const connectionString =
      "postgresql://user:password@database.example.com/app";

    expect(withExplicitPostgresSslMode(connectionString)).toBe(
      connectionString,
    );
  });

  it("preserves an undefined connection string", () => {
    expect(withExplicitPostgresSslMode(undefined)).toBeUndefined();
  });
});
