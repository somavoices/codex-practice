import { afterAll, beforeAll, beforeEach } from "vitest";
import { execSync } from "node:child_process";

process.env.DATABASE_URL = "file:./test.db";
process.env.NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "test-secret";
process.env.NEXTAUTH_URL =
  process.env.NEXTAUTH_URL ?? "http://localhost:3000";

import { prisma } from "../backend/lib/prisma";

beforeAll(async () => {
  if (!process.env.__PRISMA_TEST_DB_INITIALISED) {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });
    execSync("npx prisma db seed", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });
    process.env.__PRISMA_TEST_DB_INITIALISED = "true";
  }
  await prisma.$connect();
});

beforeEach(async () => {
  // Clean tables between tests
  await prisma.borrowRequest.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
