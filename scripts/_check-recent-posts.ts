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

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const DAYS_AGO = 14;
const SINCE = new Date(Date.now() - DAYS_AGO * 24 * 60 * 60 * 1000).toISOString();
const DOW = ["日","月","火","水","木","金","土"];

function jstLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const dow = DOW[jst.getDay()];
  return jst.toISOString().slice(0, 16).replace("T", " ") + " JST (" + dow + ")";
}

async function main() {
  console.log("=== blog_posts: since " + SINCE.slice(0, 10) + " ===");

  const { data: bp, error: bpErr } = await sb
    .from("blog_posts")
    .select("slug, is_published, published_at, created_at")
    .gte("created_at", SINCE)
    .order("created_at", { ascending: true });

  if (bpErr) { console.error("blog_posts error:", bpErr.message); process.exit(1); }

  for (const r of bp ?? []) {
    const raw = r.published_at ?? r.created_at ?? SINCE;
    const pub = r.is_published ? "[pub]" : "[dft]";
    console.log("  " + jstLabel(raw) + "  " + pub + "  " + r.slug);
  }

  const visaN = (bp ?? []).filter(r => r.slug.startsWith("visa-")).length;
  const simN  = (bp ?? []).filter(r => r.slug.startsWith("simulator-")).length;
  const studyN = (bp ?? []).filter(r => r.slug.startsWith("study-")).length;
  const otherN = (bp ?? []).length - visaN - simN - studyN;
  console.log("\nblog_posts total: " + (bp?.length ?? 0));
  console.log("  visa-*: " + visaN + " / simulator-*: " + simN + " / study-*: " + studyN + " / other: " + otherN);

  const byDow: Record<string, number> = {};
  for (const r of bp ?? []) {
    const raw = r.published_at ?? r.created_at ?? SINCE;
    const d = new Date(raw);
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const k = DOW[jst.getDay()];
    byDow[k] = (byDow[k] ?? 0) + 1;
  }
  console.log("  by DOW: " + JSON.stringify(byDow));

  console.log("\n=== study_blog_posts: since " + SINCE.slice(0, 10) + " ===");
  const { data: sp, error: spErr } = await sb
    .from("study_blog_posts")
    .select("slug, is_published, created_at")
    .gte("created_at", SINCE)
    .order("created_at", { ascending: true });

  if (spErr) { console.error("study_blog_posts error:", spErr.message); process.exit(1); }

  for (const r of sp ?? []) {
    const pub = r.is_published ? "[pub]" : "[dft]";
    console.log("  " + jstLabel(r.created_at) + "  " + pub + "  " + r.slug);
  }
  console.log("\nstudy_blog_posts total: " + (sp?.length ?? 0));

  const spDow: Record<string, number> = {};
  for (const r of sp ?? []) {
    const d = new Date(r.created_at);
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    const k = DOW[jst.getDay()];
    spDow[k] = (spDow[k] ?? 0) + 1;
  }
  console.log("  by DOW: " + JSON.stringify(spDow));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
