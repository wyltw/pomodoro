const deprecatedStrictSslModes = new Set(["prefer", "require", "verify-ca"]);

export function withExplicitPostgresSslMode(
  connectionString: string | undefined,
) {
  if (!connectionString) return connectionString;

  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode");

  if (sslMode && deprecatedStrictSslModes.has(sslMode)) {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}
