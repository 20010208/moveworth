/**
 * 2記事のDB書き込み
 * 1. study-abroad-remittance-guide-2026: content.en 全文置き換え
 * 2. study-abroad-work-rules-all-countries-2026: JA拒否テキスト削除 + content.en 全文置き換え
 */
import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const t = line.trim(); if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq < 0) continue;
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// ===== 記事1: remittance-guide EN =====
const REMITTANCE_EN = `Managing money while studying abroad is one of the most important practical skills for international students. This guide compares three main methods — Wise (formerly TransferWise), credit cards, and bank transfers — to help you choose the most cost-effective approach in 2026.

### Wise: Pros and Cons

Wise has become one of the most popular remittance services among international students, thanks to its low fees and real-time exchange rates.

**Advantages**
- **Low fees**: Transaction fees are typically well under 1% — far cheaper than traditional bank transfers
- **Real-time exchange rates**: Wise applies mid-market rates without hidden markups
- **Fast transfers**: Most transfers complete within 1–2 business days

**Disadvantages**
- Transfer limits apply depending on your account verification level
- Service availability varies by country — confirm before departing

### Credit Cards for Overseas Spending

Using a credit card for overseas spending and cash advances is convenient, but fees can add up quickly.

- **Convenience**: Widely accepted and useful in emergencies
- **Rewards points**: Some cards earn points or miles on overseas transactions

However, foreign transaction fees and cash advance charges can be significant. Reserve credit cards for everyday purchases rather than large regular transfers.

### Bank Transfers: Reliable but Expensive

Traditional telegraphic transfers are reliable and suitable for large one-off amounts, but come with higher costs.

- **Security**: Major banks provide high-security, tracked transactions
- **Best for large amounts**: Bank transfers may offer better per-unit rates for high-value transfers

Watch out for outbound transfer fees, recipient bank fees, and intermediary bank charges — these can stack up and significantly reduce the amount received.

### Tips for Students Sending Money Abroad

- **Watch for rate fluctuations**: Exchange rates change daily; time your transfers when rates are favorable
- **Check local regulations**: Some countries restrict the purpose or maximum amount of international transfers
- **Understand each service's terms**: Read the fine print on fees, limits, and processing times before committing

For a cost simulation of your study abroad budget, visit [MoveWorth.study](https://study.moveworthapp.com/simulate).

### FAQ

**Q: How much does Wise typically charge?**
A: Fees vary by currency pair and transfer amount, but are generally under 1% — significantly lower than bank telegraphic transfers.

**Q: Are there risks to using a credit card for transfers?**
A: Yes — foreign transaction fees and cash advance interest can make credit cards expensive for regular transfers. Check your card's overseas fee structure before relying on it.

**Q: How long do bank transfers take?**
A: Typically 3–5 business days. Transfers routed through multiple intermediary banks may take longer.

**Q: What information do I need to send money overseas?**
A: You'll need the recipient's bank account number, IBAN or SWIFT/BIC code, transfer amount, and destination currency.

### Summary

Choosing the right remittance method while studying abroad comes down to balancing fees, speed, and convenience. Wise offers the lowest fees for regular transfers; credit cards work well for everyday overseas spending; bank transfers are best reserved for large one-off amounts. Researching your options before departure will save you real money throughout your time abroad.

### References
- [Wise — Pricing & Fees](https://wise.com/pricing)`;

// ===== 記事2: work-rules EN =====
const WORKRULES_EN = `Working part-time while studying abroad can help cover living costs and provide valuable language practice and real-world work experience. However, rules vary dramatically by country — violations can lead to immediate visa cancellation, deportation, and lasting consequences for future visa applications. Always confirm the current rules before departure.

### How Work Rules Work

When studying on a student visa, most countries allow limited part-time work under specific conditions:

- **Some countries require a separate work permit** in addition to the student visa
- **Term-time and vacation rules differ**: Many countries relax hour limits during summer/winter breaks
- **Full-time work is generally prohibited**: Student visas are issued on the premise that study is the primary purpose
- **Certain job types may be restricted**: Roles unrelated to your field of study are sometimes prohibited

### Work Rules by Country (40 Countries)

| Country | During Term (per week) | During Holidays | Notes |
|---|---|---|---|
| [🇦🇺 Australia](/blog/study-work-au) | 48 hrs/fortnight | Unrestricted | Expanded in 2023 |
| [🇨🇦 Canada](/blog/study-work-ca) | 24 hrs (off-campus) | Unrestricted (off-campus) | Updated Nov 2024 |
| [🇬🇧 UK](/blog/study-work-gb) | 20 hrs | 40 hrs | Student visa (Tier 4) |
| [🇺🇸 USA](/blog/study-work-us) | 20 hrs on-campus only | 40 hrs on-campus only | Off-campus generally prohibited |
| [🇳🇿 New Zealand](/blog/study-work-nz) | 25 hrs | Full-time | Updated Nov 2025 |
| [🇩🇪 Germany](/blog/study-work-de) | 120 days/yr (full) or 240 days (half-day) | Same | EU residents have additional freedom |
| [🇫🇷 France](/blog/study-work-fr) | 964 hrs/yr | Same | Work rights included in student visa |
| [🇯🇵 Japan](/blog/study-work-jp) | 28 hrs | 40 hrs (school breaks) | "Permission to Engage in Activity Other Than That Permitted" required |
| [🇰🇷 South Korea](/blog/study-work-kr) | D-2 undergrad: 20 hrs / grad: 35 hrs | Full-time | D-4 (language): 20 hrs from month 6 |
| [🇸🇬 Singapore](/blog/study-work-sg) | 16 hrs | Full-time | Approved institution required |
| [🇲🇾 Malaysia](/blog/study-work-my) | Not permitted | 20 hrs (term breaks only) | Limited to F&B and service industries |
| [🇹🇭 Thailand](/blog/study-work-th) | Prohibited | Prohibited | Separate work visa required |
| [🇻🇳 Vietnam](/blog/study-work-vn) | Prohibited | Prohibited | Language volunteering may be permitted |
| [🇮🇩 Indonesia](/blog/study-work-id) | Prohibited | Prohibited | Work visa required |
| [🇵🇭 Philippines](/blog/study-work-ph) | Prohibited (SWP required) | Prohibited (SWP required) | Special Work Permit from BI required |
| [🇭🇰 Hong Kong](/blog/study-work-hk) | No limit (university students, from Nov 2024) | No limit | Verify for language school students |
| [🇹🇼 Taiwan](/blog/study-work-tw) | 20 hrs | 40 hrs | Bachelor's degree students and above |
| [🇳🇱 Netherlands](/blog/study-work-nl) | 16 hrs | 40 hrs (Jun–Aug only) | Employer must obtain TWV permit |
| [🇨🇭 Switzerland](/blog/study-work-ch) | 15 hrs | Full-time | From 6 months after enrollment; may exclude language school students |
| [🇸🇪 Sweden](/blog/study-work-se) | No limit | No limit | Non-EU/EEA students should verify |
| [🇳🇴 Norway](/blog/study-work-no) | 20 hrs | 40 hrs | Accredited program enrollment required |
| [🇩🇰 Denmark](/blog/study-work-dk) | 20 hrs | 40 hrs (Jun–Aug only) | EU Blue Card is a separate option |
| [🇫🇮 Finland](/blog/study-work-fi) | 30 hrs avg/week | Full-time | Managed as annual average of 30 hrs |
| [🇦🇹 Austria](/blog/study-work-at) | 20 hrs | 20 hrs | Proof of academic progress required |
| [🇨🇿 Czech Republic](/blog/study-work-cz) | 20 hrs | 20 hrs | Employment permit required (CZK 500) |
| [🇵🇹 Portugal](/blog/study-work-pt) | 20 hrs | 40 hrs | Work rights included in student visa |
| [🇪🇸 Spain](/blog/study-work-es) | 30 hrs | 40 hrs | Increased from 20 hrs in 2025 |
| [🇮🇹 Italy](/blog/study-work-it) | 20 hrs | 40 hrs | Visto per Studio conditions apply |
| [🇬🇷 Greece](/blog/study-work-gr) | 20 hrs | 40 hrs | EU/EEA students unrestricted |
| [🇮🇪 Ireland](/blog/study-work-ie) | 20 hrs | 40 hrs (Jun–Sep & Dec–Jan) | May exclude language school students |
| 🇧🇪 Belgium | Unrestricted (conditions apply) | Unrestricted | Student ID required |
| [🇦🇪 UAE (Dubai)](/blog/study-work-ae) | Prohibited (university internships only) | Same | General part-time work prohibited |
| [🇲🇹 Malta](/blog/study-work-mt) | 20 hrs (from month 3) | 20 hrs | No work permitted for first 3 months |
| [🇿🇦 South Africa](/blog/study-work-za) | Up to 20 hrs (conditions apply) | Full-time | Work authorization must be stated in visa |
| [🇬🇪 Georgia](/blog/study-work-ge) | Work permit required (regulations under revision as of 2026) | Same | New rules being introduced in 2026 — verify before departure |
| [🇧🇷 Brazil](/blog/study-work-br) | Prohibited | Prohibited | Internships may be possible |
| [🇨🇴 Colombia](/blog/study-work-co) | 20 hrs (postgrad only) | Same | Undergraduate and language school students prohibited |
| [🇲🇽 Mexico](/blog/study-work-mx) | Prohibited (some internships allowed) | Same | Exceptions via university agreements |
| [🇦🇷 Argentina](/blog/study-work-ar) | Prohibited | Prohibited | Separate work permit required |
| [🇨🇳 China](/blog/study-work-cn) | X1 visa: 8–16 hrs (PSB approval) / X2: prohibited | Same | Work endorsement in PSB residence permit required |
| [🇮🇳 India](/blog/study-work-in) | Prohibited | Prohibited | Internships depend on institution |

### Consequences of Unauthorized Work

Working without authorization on a student visa can result in:
1. Immediate visa cancellation and deportation
2. Negative impact on future visa applications (including tourist and work visas)
3. Entry ban of up to 10 years
4. Penalties for the employer as well

In countries with strict restrictions, consider **volunteering at a language school** or **university-approved internships** to gain experience without risking your visa status.

### Detailed Country Information

For in-depth information on required documents, application procedures, and penalties for each country, see the individual country articles linked in the table above.

---

Working part-time abroad is a valuable experience, but rule violations can have long-lasting consequences. Always confirm the current rules with the local immigration authority or your school's international student advisor before starting work.

### References
The information in this article is based on the following official sources.
- [Ministry of Foreign Affairs of Japan](https://www.mofa.go.jp)
- [Ministry of Health, Labour and Welfare of Japan](https://www.mhlw.go.jp)
- [U.S. Department of State](https://www.state.gov)
- [Australian Department of Home Affairs](https://immi.homeaffairs.gov.au)
- [UK Visas and Immigration (UKVI)](https://www.gov.uk/government/organisations/uk-visas-and-immigration)`;

// JA拒否テキスト（\n\n込み）
const JA_REFUSAL = "申し訳ありませんが、実在する正確なURLを提供することはできません。しかし、以下のような機関を参考にすることが一般的です。\n\n";

async function patch(slug: string, fn: (c: Record<string, string>) => Record<string, string>, label: string) {
  const { data, error: fetchErr } = await sb
    .from("study_blog_posts")
    .select("content")
    .eq("slug", slug)
    .single();
  if (fetchErr || !data) { console.error(`❌ ${label} fetch失敗:`, fetchErr?.message); return false; }

  const newContent = fn(data.content as Record<string, string>);
  const { error } = await sb
    .from("study_blog_posts")
    .update({ content: newContent })
    .eq("slug", slug);
  if (error) { console.error(`❌ ${label} 書き込み失敗:`, error.message); return false; }
  console.log(`✅ ${label} 書き込み完了`);
  return true;
}

async function main() {
  // 記事1: remittance-guide — EN置き換えのみ
  await patch(
    "study-abroad-remittance-guide-2026",
    (c) => ({ ...c, en: REMITTANCE_EN }),
    "remittance-guide EN"
  );

  // 記事2: work-rules — JA修正 + EN置き換え
  await patch(
    "study-abroad-work-rules-all-countries-2026",
    (c) => {
      const jaOrig = c.ja ?? "";
      if (!jaOrig.includes(JA_REFUSAL)) {
        console.warn("  ⚠️ work-rules JA: 拒否テキストが見つかりません（スキップ）");
        return { ...c, en: WORKRULES_EN };
      }
      const jaFixed = jaOrig.replace(JA_REFUSAL, "");
      console.log(`  work-rules JA: ${jaOrig.length}字 → ${jaFixed.length}字（-${jaOrig.length - jaFixed.length}字）`);
      return { ...c, ja: jaFixed, en: WORKRULES_EN };
    },
    "work-rules JA+EN"
  );

  // 書き込み後確認
  console.log("\n=== 書き込み後確認 ===");
  const slugs = ["study-abroad-remittance-guide-2026", "study-abroad-work-rules-all-countries-2026"];
  for (const slug of slugs) {
    const { data } = await sb.from("study_blog_posts").select("content").eq("slug", slug).single();
    const c = (data?.content ?? {}) as Record<string, string>;
    const jaLen = (c.ja ?? "").trim().length;
    const enLen = (c.en ?? "").trim().length;
    const pct = jaLen > 0 ? Math.round((enLen / jaLen) * 100) : 0;
    const hasRefusal = /申し訳ありませんが|I'm sorry.*can'?t/i.test((c.ja ?? "") + (c.en ?? ""));
    console.log(`${slug}: ja=${jaLen} en=${enLen}(${pct}%) 拒否パターン=${hasRefusal ? "❌残存" : "✅なし"}`);
  }

  console.log("\n=== 完了 ===");
}
main().catch(e => { console.error(e); process.exit(1); });
