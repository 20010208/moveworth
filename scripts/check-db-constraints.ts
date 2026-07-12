import { existsSync, readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
async function main() {
  if (existsSync('.env.local')) {
    for (const line of readFileSync('.env.local','utf-8').split('\n')) {
      const t=line.trim(); if(!t||t.startsWith('#')) continue;
      const eq=t.indexOf('='); if(eq<0) continue;
      const key=t.slice(0,eq).trim();
      if(!(key in process.env)) process.env[key]=t.slice(eq+1).trim();
    }
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: p } = await sb.from('country_sources').select('purpose');
  const { data: s } = await sb.from('country_sources').select('status');
  const purposes = [...new Set((p??[]).map((r: {purpose:string}) => r.purpose))].sort();
  const statuses = [...new Set((s??[]).map((r: {status:string}) => r.status))].sort();
  console.log('purpose values in DB:', JSON.stringify(purposes));
  console.log('status values in DB:', JSON.stringify(statuses));
  console.log('total rows:', p?.length);
}
main().catch(console.error);
