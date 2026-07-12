/**
 * blog_posts への insert/update 前の共通バリデーション
 *
 * 使い方:
 *   import { assertBlogPayload } from "./utils/validate-blog-payload";
 *   assertBlogPayload({ title, description, content }, slug);  // 不正なら例外を投げる
 *
 * ルール:
 *   - title / description / content は非 null のオブジェクト
 *   - locales が null（全言語対象）: ja と en が非空文字列
 *   - locales が設定済み: その配列内の各言語が非空文字列
 */

type MultiLangPayload = { ja?: unknown; en?: unknown; zh?: unknown } | null | undefined;

export interface BlogPayload {
  title?: MultiLangPayload;
  description?: MultiLangPayload;
  content?: MultiLangPayload;
  locales?: string[] | null;
}

function checkField(fieldName: string, val: MultiLangPayload, requiredLangs: string[]): string[] {
  const errors: string[] = [];

  if (val === null || val === undefined) {
    errors.push(`${fieldName} が null/undefined`);
    return errors;
  }
  if (typeof val !== "object" || Array.isArray(val)) {
    errors.push(`${fieldName} の型不正 (${typeof val})`);
    return errors;
  }

  const obj = val as Record<string, unknown>;
  for (const lang of requiredLangs) {
    const v = obj[lang];
    if (v === undefined || v === null) {
      errors.push(`${fieldName}.${lang} が null/undefined`);
    } else if (typeof v !== "string") {
      errors.push(`${fieldName}.${lang} の型不正 (${typeof v})`);
    } else if (v.trim().length === 0) {
      errors.push(`${fieldName}.${lang} が空文字`);
    }
  }
  return errors;
}

/**
 * バリデーション失敗時に console.error + Error を throw する
 * @param payload - insert/update する title/description/content/locales
 * @param slug    - ログ出力用スラッグ
 */
export function assertBlogPayload(payload: BlogPayload, slug: string): void {
  const requiredLangs = payload.locales && payload.locales.length > 0
    ? payload.locales
    : ["ja", "en"];

  const errors = [
    ...(payload.title !== undefined ? checkField("title", payload.title, requiredLangs) : []),
    ...(payload.description !== undefined ? checkField("description", payload.description, requiredLangs) : []),
    ...(payload.content !== undefined ? checkField("content", payload.content, requiredLangs) : []),
  ];

  if (errors.length > 0) {
    console.error(`\n❌ [BLOG-PAYLOAD-VALIDATION] ${slug} — DB書き込みをabortします`);
    for (const e of errors) console.error(`   • ${e}`);
    throw new Error(`blog_posts payload validation failed for "${slug}": ${errors.join("; ")}`);
  }
}
