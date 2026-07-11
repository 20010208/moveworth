import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = t.slice(eq + 1).trim();
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { count, error } = await supabase
    .from("simulator_personas")
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // 全件削除（常にtrue条件）

  if (error) {
    console.error("Delete failed:", error.message);
    process.exit(1);
  }
  console.log(`✅ Deleted ${count} rows from simulator_personas`);
}

main();
