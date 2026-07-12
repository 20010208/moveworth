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
  // visa-th の現在状態
  const {data:th}=await sb.from("blog_posts").select("slug,is_published,published_at").eq("slug","visa-th").single();
  console.log("visa-th:", JSON.stringify(th));

  // category別件数
  const {data:cats}=await sb.from("blog_posts").select("category,is_published");
  const m=new Map<string,{pub:number,draft:number}>();
  for(const r of cats??[]) {
    const k=r.category??'(null)';
    if(!m.has(k)) m.set(k,{pub:0,draft:0});
    if(r.is_published) m.get(k)!.pub++; else m.get(k)!.draft++;
  }
  console.log("\n--- category別件数 ---");
  for(const [k,v] of [...m.entries()].sort()) {
    console.log(`  ${k}: 公開=${v.pub} draft=${v.draft} 合計=${v.pub+v.draft}`);
  }
}
main().catch(console.error);
