"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // implicit flow: wait for Supabase to auto-detect #access_token and set session
      await new Promise<void>((resolve) => {
        // Check if session is already set (Supabase may have processed hash synchronously)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) { resolve(); return; }

          // Otherwise wait for SIGNED_IN event
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_IN") {
              subscription.unsubscribe();
              resolve();
            }
          });
          // Fallback: give up after 5 seconds and redirect anyway
          setTimeout(() => { subscription.unsubscribe(); resolve(); }, 5000);
        });
      });

      // Full page reload to ensure AuthProvider picks up the new session
      window.location.href = "/";
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Globe className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            MoveWorth
          </span>
        </div>
        <Loader2 className="h-10 w-10 text-primary mx-auto animate-spin" />
        <p className="mt-4 text-sm text-muted">ログイン処理中...</p>
      </div>
    </div>
  );
}
