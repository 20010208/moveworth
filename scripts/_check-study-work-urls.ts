// study-work-{code} URL疎通チェック
// 既存40件から代表サンプル + リネーム11件全件 をチェック
const BASE = "https://study.moveworthapp.com/blog";

// 既存40件の代表サンプル（移行前から存在していたもの）
const EXISTING_SAMPLE = ["au", "us", "gb", "de", "sg", "nz", "ca", "fr", "jp", "kr"];

// リネームした11件（study-{code} → study-work-{code}）
const RENAMED = ["be", "bg", "cy", "ee", "hr", "hu", "me", "pl", "ro", "rs", "tn"];

async function checkUrl(slug: string): Promise<{ slug: string; status: number | string }> {
  try {
    const res = await fetch(`${BASE}/${slug}`, { method: "HEAD", redirect: "follow" });
    return { slug, status: res.status };
  } catch (e: unknown) {
    return { slug, status: `ERROR: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function main() {
  const existing = EXISTING_SAMPLE.map(c => `study-work-${c}`);
  const renamed = RENAMED.map(c => `study-work-${c}`);

  console.log("=== 既存40件 代表サンプル（移行前から存在）===");
  const r1 = await Promise.all(existing.map(checkUrl));
  for (const r of r1) {
    const ok = r.status === 200 ? "✅" : "❌";
    console.log(`  ${ok} ${r.slug.padEnd(22)} → ${r.status}`);
  }

  console.log("\n=== リネーム11件（study-{code}→study-work-{code}）===");
  const r2 = await Promise.all(renamed.map(checkUrl));
  for (const r of r2) {
    const ok = r.status === 200 ? "✅" : "❌";
    console.log(`  ${ok} ${r.slug.padEnd(22)} → ${r.status}`);
  }

  const all = [...r1, ...r2];
  const ok = all.filter(r => r.status === 200).length;
  console.log(`\n合計: ${ok}/${all.length} 件 200 OK`);
}
main().catch(e => { console.error(e); process.exit(1); });
