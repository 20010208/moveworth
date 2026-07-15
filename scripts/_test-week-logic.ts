/**
 * ISO週番号ベースの隔週切替ロジック テスト
 * 実行して 1週目/2週目 の判定と、来週の反転を確認する
 */

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function weekType(date: Date): "week1" | "week2" {
  return getISOWeek(date) % 2 === 1 ? "week1" : "week2";
}

const today = new Date();
console.log("=== ISO週番号テスト ===\n");

// 今週から4週分チェック
for (let i = 0; i < 28; i += 7) {
  const d = new Date(today);
  d.setDate(d.getDate() + i);
  // 水曜日（その週の水曜）
  const wed = new Date(d);
  wed.setDate(d.getDate() - d.getDay() + 3);
  // 金曜日
  const fri = new Date(d);
  fri.setDate(d.getDate() - d.getDay() + 5);

  const wedWeek = getISOWeek(wed);
  const wt = weekType(wed);

  console.log(`Week ${wedWeek} (${wed.toISOString().slice(0,10)} 水 〜 ${fri.toISOString().slice(0,10)} 金)`);
  console.log(`  判定: ${wt}`);
  console.log(`  水曜: ${wt === "week1" ? "移住・お金" : "ビザ詳細情報（スキップ）"}`);
  console.log(`  金曜: ${wt === "week1" ? "ライフプラン" : "移住シミュレーション"}`);
  console.log();
}

// 現在日時での判定
console.log("=== 現時点（実行日）の判定 ===");
console.log(`Today: ${today.toISOString().slice(0,10)}`);
console.log(`ISO Week: ${getISOWeek(today)}`);
console.log(`Week type: ${weekType(today)}`);
