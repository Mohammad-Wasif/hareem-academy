import { spawn } from "child_process";
import path from "path";

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = "postgresql://neondb_owner:npg_ZtpDFwn65RXc@ep-broad-cloud-am43a2jx-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

console.log("[Script] Starting drizzle-kit push in lib/db...");
const child = spawn("npx", ["drizzle-kit", "push", "--config", "./drizzle.config.ts"], {
  env,
  cwd: path.resolve("lib/db"),
  shell: true
});

child.stdout.on("data", (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  if (output.includes("created or renamed") || output.includes("table?") || output.includes("column?")) {
    console.log("\n[Script] Auto-approving prompt by sending newline...");
    child.stdin.write("\r\n");
  }
});

child.stderr.on("data", (data) => {
  process.stderr.write(data.toString());
});

child.on("close", (code) => {
  console.log(`[Script] Child process exited with code ${code}`);
  process.exit(code);
});
