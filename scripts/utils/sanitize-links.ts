/**
 * GPTが生成したコンテンツ内の誤ったMoveWorthリンクを正しいURLに修正する。
 * - moveworth.com (typo) → moveworthapp.com
 * - moveworthapp.com のルートのみ → /simulate へ誘導
 * isStudy: true の場合は study.moveworthapp.com/simulate を使う
 */
export function sanitizeMoveWorthLinks(content: string, isStudy = false): string {
  const mainUrl = "https://moveworthapp.com/simulate";
  const studyUrl = "https://study.moveworthapp.com/simulate";
  const correctUrl = isStudy ? studyUrl : mainUrl;

  return content
    // 誤ドメイン: moveworth.com（appなし）→ 正しいURL
    .replace(/https?:\/\/(www\.)?moveworth\.com\b[^\s)\]"]*/g, correctUrl)
    // 誤ドメイン: moveworth\.app → 正しいURL
    .replace(/https?:\/\/(www\.)?moveworth\.app\b[^\s)\]"]*/g, correctUrl)
    // moveworthapp.com ルートのみ（/simulate なし）→ /simulate を追加
    .replace(/https:\/\/moveworthapp\.com(?!\/)(?=[)\]\s"])/g, mainUrl)
    .replace(/https:\/\/moveworthapp\.com\/(?!simulate|blog|pricing|about|contact)[^\s)\]"]*/g, mainUrl)
    // study.moveworthapp.com ルートのみ → /simulate を追加
    .replace(/https:\/\/study\.moveworthapp\.com(?!\/)(?=[)\]\s"])/g, studyUrl)
    .replace(/https:\/\/study\.moveworthapp\.com\/(?!simulate|blog)[^\s)\]"]*/g, studyUrl);
}
