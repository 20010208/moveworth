// Storage の -en.png で thumbnail_en 未登録のものを登録する
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/`;

async function listEnFiles(): Promise<string[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/list/blog-images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 500 }),
  });
  const data = (await res.json()) as { name: string }[];
  return (data ?? []).map((f) => f.name).filter((n) => /^study-country-[a-z]+-en\.png$/i.test(n)).sort();
}

async function main() {
  const enFiles = await listEnFiles();
  console.log(`Storage -en.png 在庫: ${enFiles.length}件\n`);

  // DB側の thumbnail_en 登録状況
  const { data: dbRecords } = await sb.from("study_blog_posts")
    .select("slug,thumbnail_en")
    .ilike("slug", "study-country-%")
    .order("slug");

  const dbMap = new Map<string, string | null>();
  for (const r of dbRecords ?? []) {
    const code = (r.slug as string).replace("study-country-", "");
    dbMap.set(code, r.thumbnail_en as string | null);
  }

  const toRegister: { code: string; file: string; url: string }[] = [];
  const alreadyRegistered: string[] = [];
  const noDbRecord: string[] = [];

  for (const file of enFiles) {
    const code = file.replace("study-country-", "").replace("-en.png", "");
    if (!dbMap.has(code)) {
      noDbRecord.push(file);
      continue;
    }
    const currentVal = dbMap.get(code);
    if (!currentVal) {
      toRegister.push({ code, file, url: `${BASE}${file}` });
    } else {
      alreadyRegistered.push(`${code} (${file})`);
    }
  }

  console.log(`  DB登録済み: ${alreadyRegistered.length}件`);
  console.log(`  未登録（今回登録）: ${toRegister.length}件`);
  if (noDbRecord.length) console.log(`  DBレコードなし（スキップ）: ${noDbRecord.join(", ")}`);
  console.log();

  if (toRegister.length === 0) {
    console.log("登録が必要なファイルはありません。");
    return;
  }

  let ok = 0, err = 0;
  for (const item of toRegister) {
    const { error } = await sb.from("study_blog_posts")
      .update({ thumbnail_en: item.url })
      .eq("slug", `study-country-${item.code}`);
    if (error) {
      console.error(`  ❌ ${item.file}: ${error.message}`);
      err++;
    } else {
      console.log(`  ✅ study-country-${item.code}: thumbnail_en = ${item.file}`);
      ok++;
    }
  }
  console.log(`\n登録完了: ✅ ${ok}件 / ❌ ${err}件`);
}
main().catch(e => { console.error(e); process.exit(1); });
