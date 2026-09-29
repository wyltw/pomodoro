import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { withExplicitPostgresSslMode } from "./postgres-url";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: withExplicitPostgresSslMode(process.env.DATABASE_URL),
});
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
