import { existsSync, readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local","utf-8").split("\n")) {
    const t=l.trim(); if(!t||t.startsWith("#")) continue;
    const eq=t.indexOf("="); if(eq<0) continue;
    const k=t.slice(0,eq).trim();
    if(!(k in process.env)) process.env[k]=t.slice(eq+1).trim();
  }
}
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  // visa-au 税制セクション確認
  const {data:au}=await sb.from("blog_posts").select("slug,content,is_published").eq("slug","visa-au").single();
  const ja=(au?.content as {ja?:string})?.ja??"";
  const idx=ja.indexOf("税");
  console.log("=== visa-au 税制セクション (is_published:"+au?.is_published+") ===");
  console.log(idx>=0?ja.slice(idx,idx+500):"(税セクションなし)");

  // 全公開件数
  const {data:all,count}=await sb.from("blog_posts").select("slug",{count:"exact"}).eq("is_published",true);
  console.log("\n=== 公開件数 ===");
  console.log("合計:", count, "件");

  // 前回82件との差分を探る（直近更新分を確認）
  const {data:recent}=await sb.from("blog_posts")
    .select("slug,is_published,published_at")
    .order("published_at",{ascending:false})
    .limit(5);
  console.log("\n最近更新の記事:");
  for(const r of recent??[]) console.log(` ${r.slug}: published=${r.is_published} at=${r.published_at}`);
}
main().catch(console.error);
