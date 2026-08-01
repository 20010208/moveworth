/**
 * Supabaseの単一行更新を「正確に1件成功したこと」まで検証する共通ヘルパー。
 *
 * `.select("id").single()`を使うことで、Supabase自身に0件更新・複数件更新を
 * エラーとして検知させる（.single()は返却行が0件または2件以上だとerrorになる）。
 * 加えて返却された`data.id`が更新対象のidと一致することも確認し、
 * 想定外の行を更新していないことの二重チェックとする。
 *
 * 呼び出し側はこの関数の戻り値のみでDB更新の成否を判定し、errorを警告だけして
 * 処理を継続する（成功扱いしてしまう）ことを禁止する。
 */
import type { SupabaseClient } from "@supabase/supabase-js";

export type DbUpdateResult = { ok: true } | { ok: false; message: string };

export async function updateExactlyOneById(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  table: string,
  id: string | null | undefined,
  values: Record<string, unknown>
): Promise<DbUpdateResult> {
  if (!id) {
    return { ok: false, message: "idが空/未定義のため更新できません" };
  }

  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    // Supabaseのエラーオブジェクト全体ではなくmessageのみを返す（secretやペイロード全文を出さない）
    return { ok: false, message: error.message };
  }
  if (!data || typeof data !== "object" || !("id" in data)) {
    return { ok: false, message: "更新レスポンスのdataが不正です（objectでない、またはidを含まない）" };
  }
  const returnedId = (data as { id: unknown }).id;
  if (returnedId !== id) {
    return { ok: false, message: `更新レスポンスのidが更新対象と一致しません: expected=${id} actual=${String(returnedId)}` };
  }
  return { ok: true };
}
