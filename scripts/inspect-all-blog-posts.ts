/**
 * blog_posts 全レコードの title / description / content 構造検査
 *
 * - is_published=true / false 両方を対象
 * - 各フィールドが null / 非オブジェクト / ja or en キー欠落 / 空文字 を検出
 * - 結果を slug, is_published, published_at, created_at 付きで列挙
 */
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
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type FieldName = "title" | "description" | "content";
type Row = {
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  locales: string[] | null;
  title: unknown;
  description: unknown;
  content: unknown;
};

/**
 * requiredLangs: locales が null なら ["ja","en"]、設定ありならその配列
 * 宣言されていない言語の欠落はソフト警告止まり
 */
function diagnoseField(field: FieldName, val: unknown, requiredLangs: string[]): string[] {
  const issues: string[] = [];
  if (val === null || val === undefined) {
    issues.push(`${field}: NULL/undefined`);
    return issues;
  }
  if (typeof val !== "object" || Array.isArray(val)) {
    issues.push(`${field}: 型不正 (${typeof val})`);
    return issues;
  }
  const obj = val as Record<string, unknown>;
  // 必須言語チェック（ハードエラー）
  for (const lang of requiredLangs) {
    const v = obj[lang];
    if (v === undefined) {
      issues.push(`${field}.${lang}: キー欠落`);
    } else if (v === null) {
      issues.push(`${field}.${lang}: null`);
    } else if (typeof v !== "string") {
      issues.push(`${field}.${lang}: 型不正 (${typeof v})`);
    } else if ((v as string).trim().length === 0) {
      issues.push(`${field}.${lang}: 空文字`);
    }
  }
  // 非必須言語（ソフト警告）
  for (const lang of ["ja", "en", "zh"] as const) {
    if (requiredLangs.includes(lang)) continue;
    const v = obj[lang];
    if (v === undefined) {
      issues.push(`${field}.${lang}: キー欠落 (警告・非必須)`);
    } else if (v !== null && typeof v !== "string") {
      issues.push(`${field}.${lang}: 型不正 (${typeof v}) (警告)`);
    }
  }
  return issues;
}

async function main() {
  console.log("=== blog_posts 全件構造検査 ===\n");

  const { data, error } = await sb
    .from("blog_posts")
    .select("slug, is_published, published_at, created_at, locales, title, description, content")
    .order("created_at", { ascending: false });

  if (error) { console.error("取得エラー:", error.message); process.exit(1); }

  const rows = (data ?? []) as Row[];
  console.log(`総件数: ${rows.length} 件 (公開: ${rows.filter(r => r.is_published).length} 件, 非公開: ${rows.filter(r => !r.is_published).length} 件)\n`);

  const broken: Array<{ slug: string; is_published: boolean; published_at: string | null; created_at: string | null; issues: string[] }> = [];
  const ok: string[] = [];

  for (const row of rows) {
    // locales が設定されている場合はその言語のみ必須、未設定なら ja+en 必須
    const requiredLangs: string[] = row.locales && row.locales.length > 0
      ? row.locales
      : ["ja", "en"];
    const issues: string[] = [
      ...diagnoseField("title", row.title, requiredLangs),
      ...diagnoseField("description", row.description, requiredLangs),
      ...diagnoseField("content", row.content, requiredLangs),
    ];
    // zh警告のみの場合は "ok (zh欠落)" 扱いにして broken には入れない
    const hardIssues = issues.filter(i => !i.includes("警告"));
    if (hardIssues.length > 0) {
      broken.push({ slug: row.slug, is_published: row.is_published, published_at: row.published_at, created_at: row.created_at, issues });
    } else {
      ok.push(row.slug);
    }
  }

  console.log(`✅ 正常: ${ok.length} 件`);
  console.log(`❌ 構造不正: ${broken.length} 件\n`);

  if (broken.length > 0) {
    console.log("--- 構造不正レコード一覧 ---");
    for (const b of broken) {
      const pub = b.is_published ? "公開" : "非公開";
      console.log(`\n[${b.slug}]  ${pub}  published_at: ${b.published_at ?? "-"}  created_at: ${b.created_at ?? "-"}`);
      for (const issue of b.issues) {
        const warn = issue.includes("警告");
        console.log(`  ${warn ? "⚠️ " : "❌ "} ${issue}`);
      }
    }
  }

  // zh欠落のみの記事も別掲 (ソフト警告)
  const zhOnlyWarn = rows.filter(r => {
    const req = r.locales && r.locales.length > 0 ? r.locales : ["ja", "en"];
    const allIssues = [
      ...diagnoseField("title", r.title, req),
      ...diagnoseField("description", r.description, req),
      ...diagnoseField("content", r.content, req),
    ];
    const hard = allIssues.filter(i => !i.includes("警告"));
    const soft = allIssues.filter(i => i.includes("警告"));
    return hard.length === 0 && soft.length > 0;
  });
  if (zhOnlyWarn.length > 0) {
    console.log(`\n--- zh キー欠落のみ (ソフト警告・クラッシュには至らない): ${zhOnlyWarn.length} 件 ---`);
    for (const r of zhOnlyWarn) {
      console.log(`  ⚠️  ${r.slug}  (${r.is_published ? "公開" : "非公開"})`);
    }
  }

  console.log("\n=== 完了 ===");
  process.exit(broken.length > 0 ? 1 : 0);
}

main().catch(console.error);
