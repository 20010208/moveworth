import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { SimulationResult } from "@/lib/simulation/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 認証チェック：Premiumユーザーのみ許可
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.user_metadata?.plan !== "premium") {
      return NextResponse.json({ error: "Premium plan required" }, { status: 403 });
    }

    const { result, locale }: { result: SimulationResult; locale: string } = await req.json();

    if (!result) {
      return NextResponse.json({ error: "Missing result" }, { status: 400 });
    }

    const isJa = locale === "ja";
    const input = result.input;
    const lastYear = result.yearlyResults[result.yearlyResults.length - 1];

    const prompt = isJa
      ? `あなたは移住・財務アドバイザーです。以下のシミュレーションデータをもとに、日本語で詳細な移住財務分析レポートを作成してください。

## シミュレーションデータ
- 現在の国: ${input.countryFrom}
- 移住先: ${input.countryTo}
- 現在の年収: ${input.incomeCurrent.toLocaleString()} ${input.currencyCurrent}
- 移住先の年収: ${input.incomeTarget.toLocaleString()} ${input.currencyTarget}
- 現在の税率: ${(input.taxRateCurrent * 100).toFixed(1)}%
- 移住先の税率: ${(input.taxRateTarget * 100).toFixed(1)}%
- 現在の家賃（月）: ${input.rentCurrent.toLocaleString()} ${input.currencyCurrent}
- 移住先の家賃（月）: ${input.rentTarget.toLocaleString()} ${input.currencyTarget}
- 現在の生活費（月）: ${input.livingCostCurrent.toLocaleString()} ${input.currencyCurrent}
- 移住先の生活費（月）: ${input.livingCostTarget.toLocaleString()} ${input.currencyTarget}
- 現在の貯蓄: ${input.currentSavings.toLocaleString()} ${input.savingsCurrency}
- 為替レート: 1 ${input.currencyTarget} = ${input.exchangeRate} ${input.currencyCurrent}
- シミュレーション期間: ${input.simulationYears}年

## シミュレーション結果
- 年間貯蓄（現在）: ${result.annualSavingsCurrent.toLocaleString()} ${input.currencyCurrent}
- 年間貯蓄（移住先）: ${result.annualSavingsTarget.toLocaleString()} ${input.currencyTarget}
- ${input.simulationYears}年後の資産（現在）: ${lastYear.assetCurrent.toLocaleString()} ${input.currencyCurrent}
- ${input.simulationYears}年後の資産（移住先）: ${lastYear.assetTarget.toLocaleString()} ${input.currencyTarget}
- 資産差額（${input.currencyCurrent}換算）: ${result.assetDifference.toLocaleString()} ${input.currencyCurrent}

以下のセクションを含む詳細レポートを作成してください：
1. エグゼクティブサマリー（移住の財務的メリット・デメリットの概要）
2. 収支分析（現在の国 vs 移住先の比較）
3. 資産形成予測（${input.simulationYears}年後の見通し）
4. 税金・コスト面の考察
5. リスクと注意点
6. 結論と推奨事項

各セクションは具体的な数字を含め、実用的なアドバイスを提供してください。`
      : `You are a relocation and financial advisor. Based on the simulation data below, create a detailed financial relocation analysis report in English.

## Simulation Data
- Current Country: ${input.countryFrom}
- Destination: ${input.countryTo}
- Current Annual Income: ${input.incomeCurrent.toLocaleString()} ${input.currencyCurrent}
- Target Annual Income: ${input.incomeTarget.toLocaleString()} ${input.currencyTarget}
- Current Tax Rate: ${(input.taxRateCurrent * 100).toFixed(1)}%
- Target Tax Rate: ${(input.taxRateTarget * 100).toFixed(1)}%
- Current Monthly Rent: ${input.rentCurrent.toLocaleString()} ${input.currencyCurrent}
- Target Monthly Rent: ${input.rentTarget.toLocaleString()} ${input.currencyTarget}
- Current Monthly Living: ${input.livingCostCurrent.toLocaleString()} ${input.currencyCurrent}
- Target Monthly Living: ${input.livingCostTarget.toLocaleString()} ${input.currencyTarget}
- Current Savings: ${input.currentSavings.toLocaleString()} ${input.savingsCurrency}
- Exchange Rate: 1 ${input.currencyTarget} = ${input.exchangeRate} ${input.currencyCurrent}
- Simulation Period: ${input.simulationYears} years

## Simulation Results
- Annual Savings (Current): ${result.annualSavingsCurrent.toLocaleString()} ${input.currencyCurrent}
- Annual Savings (Target): ${result.annualSavingsTarget.toLocaleString()} ${input.currencyTarget}
- ${input.simulationYears}-Year Asset (Current): ${lastYear.assetCurrent.toLocaleString()} ${input.currencyCurrent}
- ${input.simulationYears}-Year Asset (Target): ${lastYear.assetTarget.toLocaleString()} ${input.currencyTarget}
- Asset Difference (in ${input.currencyCurrent}): ${result.assetDifference.toLocaleString()} ${input.currencyCurrent}

Please create a detailed report with these sections:
1. Executive Summary (overview of financial pros and cons)
2. Income & Expense Analysis (current vs target country comparison)
3. Asset Growth Projection (${input.simulationYears}-year outlook)
4. Tax & Cost Considerations
5. Risks and Caveats
6. Conclusion and Recommendations

Include specific numbers in each section and provide practical advice.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const reportText = completion.choices[0].message.content ?? "";

    return NextResponse.json({ report: reportText });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
