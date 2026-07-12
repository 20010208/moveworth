/**
 * TH rd.go.th Wayback スナップショット内に "17" "17%" が実在するか確認
 */
async function main() {
  // Wayback API で最新スナップショット URL を取得
  const apiRes = await fetch(
    "https://archive.org/wayback/available?url=https://www.rd.go.th/english/6045.html",
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" } }
  );
  const data = await apiRes.json() as { archived_snapshots?: { closest?: { url?: string; available?: boolean } } };
  const snap = data.archived_snapshots?.closest;
  console.log("Wayback snapshot:", snap?.url ?? "(none)");
  console.log("available:", snap?.available);

  if (!snap?.available || !snap.url) { console.log("No snapshot available"); return; }

  const wbRes = await fetch(snap.url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
  });
  const html = await wbRes.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  console.log(`\nStripped text length: ${text.length} chars`);

  // "17" が含まれる箇所を全て抽出
  const matches17: string[] = [];
  let idx = 0;
  while ((idx = text.indexOf("17", idx)) >= 0) {
    matches17.push(text.slice(Math.max(0, idx - 30), idx + 50).replace(/\n/g, " "));
    idx += 2;
  }
  console.log(`\n"17" の出現箇所 (${matches17.length}件):`);
  for (const m of matches17.slice(0, 30)) console.log(`  → ${m}`);

  // 標準累進税率ブラケット確認
  const brackets = ["0%", "5%", "10%", "15%", "20%", "25%", "30%", "35%", "17%"];
  console.log(`\n税率ブラケット出現確認:`);
  for (const b of brackets) {
    console.log(`  ${b}: ${text.includes(b) ? "✅ あり" : "❌ なし"}`);
  }
}

main().catch(console.error);
