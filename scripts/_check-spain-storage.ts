import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const BUCKET = "blog-images";

async function main() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: "", limit: 300 }),
  });
  const files = await res.json() as { name: string; metadata: { size: number } }[];
  const spain = files.filter(f => f.name.includes("spain"));
  console.log("spain関連ファイル:");
  for (const f of spain) {
    console.log(`  ${f.name} — ${Math.round((f.metadata?.size ?? 0) / 1024)} KB`);
  }

  // 現在のthumbnailカラムも確認
  const { data } = await sb.from("blog_posts").select("slug, thumbnail").eq("slug", "spain-digital-nomad-visa-guide-2026").single();
  console.log(`\nDB thumbnail: ${data?.thumbnail ?? "(未設定)"}`);
}
main().catch(e => { console.error(e); process.exit(1); });
