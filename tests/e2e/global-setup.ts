import { execSync } from "node:child_process";

export default async function globalSetup() {
  execSync("npm run db:test:prepare", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: "file:./test.db",
      NEXTAUTH_SECRET: "test-secret",
      NEXTAUTH_URL: "http://localhost:3000"
    }
  });
}
