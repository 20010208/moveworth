/**
 * visa-kr ZH コンテンツ DB 書き込み（承認済み）
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

const ZH_CONTENT = `韩国以其丰富的文化、先进的技术和多样的美食文化而闻名，是许多人考虑移居的理想国度。特别是首尔和釜山等主要城市，作为国际商业中心也备受瞩目。

### 主要签证类型

**工作签证（E-7）**
此签证适用于希望在韩国工作的外国人。
- **要求**：从事特定职业
- **最低条件或重要数值**：需要特定的学历或工作经验
- **有效期**：1年（可续签）
- **申请费用**：请参阅官方网站

**学生签证（D-2）**
此签证适用于在韩国大学或专科学校学习的学生。
- **要求**：获得韩国教育机构的入学许可
- **最低条件或重要数值**：需证明有能力支付学费
- **有效期**：1年（可续签）
- **申请费用**：请参阅官方网站

**旅游签证（C-3）**
此签证适用于短期旅游或商务访问。
- **要求**：旅游或短期商务目的
- **最低条件或重要数值**：停留时间不超过90天
- **有效期**：3个月
- **申请费用**：请参阅官方网站

### 生活与税务

**所得税**
- 14,000,000韩元以下：6%
- 14,000,000韩元至50,000,000韩元：15%（扣除1,260,000韩元）
- 50,000,000韩元至88,000,000韩元：24%（扣除5,760,000韩元）
- 88,000,000韩元至150,000,000韩元：35%（扣除15,440,000韩元）
- 150,000,000韩元至300,000,000韩元：38%（扣除19,940,000韩元）
- 300,000,000韩元至500,000,000韩元：40%（扣除25,940,000韩元）
- 500,000,000韩元至1,000,000,000韩元：42%（扣除35,940,000韩元）
- 1,000,000,000韩元以上：45%（扣除65,940,000韩元）

**住房费用**
在首尔市中心，1LDK公寓的月租金一般在1,000,000韩元至2,000,000韩元之间。在釜山，类似条件的月租金约为800,000韩元至1,500,000韩元。

### 费用概览

| 项目 | 费用 |
|------|------|
| 工作签证申请费 | 请参阅官方网站 |
| 学生签证申请费 | 请参阅官方网站 |
| 旅游签证申请费 | 请参阅官方网站 |

### 移居前的检查清单

1. **确认签证要求**：提前确认所需文件和条件。
2. **住房保障**：提前寻找移居地的住房。
3. **了解税制**：深入了解韩国的税制并确认必要的手续。
4. **加入医疗保险**：了解韩国的医疗保险制度，并根据需要加入。
5. **了解文化**：学习韩国的文化和习俗，以便顺利融入新生活。

移居韩国充满了魅力和可能性。做好充分的准备，享受新的生活吧。

---

### 参考资料
本文信息基于以下官方资料整理。
- [韩国出入境·外国人政策本部](https://www.immigration.go.kr)
- [韩国政府门户网站](https://www.gov.kr/portal/foreigner/en/m010102)
- [韩国国民健康保险](https://www.nhis.or.kr/nhis/index.do)
- [韩国国税厅](https://www.hometax.go.kr/)
- [韩国就业许可系统](https://www.eps.go.kr/)`;

async function main() {
  const { data } = await sb.from("blog_posts").select("content, title, description").eq("slug", "visa-kr").single();
  if (!data) { console.error("visa-kr not found"); process.exit(1); }

  const content = data.content as Record<string, string>;
  const newContent = { ...content, zh: ZH_CONTENT };

  // 拒否パターンが残っていないか確認
  if (/I'm sorry|申し訳ありません/.test(ZH_CONTENT)) {
    console.error("❌ 拒否パターンが含まれています"); process.exit(1);
  }

  const { error } = await sb.from("blog_posts").update({ content: newContent }).eq("slug", "visa-kr");
  if (error) { console.error("❌ DB更新失敗:", error.message); process.exit(1); }

  console.log(`✅ visa-kr ZH 書き込み完了: ${ZH_CONTENT.length}字`);
  console.log(`  拒否パターン: なし ✅`);
  console.log(`  参考資料URL: ${(ZH_CONTENT.match(/\(https?:\/\//g) ?? []).length}件`);
}
main().catch(e => { console.error(e); process.exit(1); });
