import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { createPool } from "mariadb";

let prisma;

function getPrismaClient() {
  const urlString = process.env.DATABASE_URL;
  if (!urlString) {
    throw new Error("DATABASE_URL environment variable is missing");
  }

  const parsed = new URL(urlString);
  const config = {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 3306,
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.substring(1),
    connectionLimit: 5,
  };

  // TiDB Cloud and secure connections require SSL config
  const sslaccept = parsed.searchParams.get("sslaccept");
  const sslmode = parsed.searchParams.get("sslmode");
  if (
    sslaccept === "strict" ||
    sslmode === "required" ||
    sslmode === "verify-ca" ||
    sslmode === "verify-full"
  ) {
    config.ssl = {
      rejectUnauthorized: true,
    };
  }

  const pool = createPool(config);
  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === "production") {
  prisma = getPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = getPrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
