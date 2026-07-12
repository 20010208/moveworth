/** rd.go.th ライブページ本文に17%が存在するか確認 */
async function main() {
  const res = await fetch("https://www.rd.go.th/english/6045.html", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MoveWorthBot/1.0)" },
  });
  console.log("HTTP", res.status);
  const html = await res.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  console.log("stripped length:", text.length);

  // 税率ブラケット存在確認
  const brackets = ["0%","5%","10%","15%","17%","20%","25%","30%","35%","40%"];
  console.log("\n税率の出現:");
  for (const b of brackets) {
    const idx = text.indexOf(b);
    const ctx = idx >= 0 ? `"${text.slice(Math.max(0,idx-40),idx+60)}"` : "(なし)";
    console.log(`  ${b}: ${idx >= 0 ? "✅" : "❌"} ${ctx}`);
  }

  // "17" の出現箇所
  console.log('\n"17" 周辺テキスト:');
  let idx = 0;
  let count = 0;
  while ((idx = text.indexOf("17", idx)) >= 0 && count < 20) {
    console.log(`  [${idx}] "${text.slice(Math.max(0,idx-30),idx+50)}"`);
    idx += 2; count++;
  }
}
main().catch(console.error);
