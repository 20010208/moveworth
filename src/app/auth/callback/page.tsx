"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // implicit flow: access_token comes in URL hash
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // Supabase client auto-detects the hash and sets the session
        // Wait for onAuthStateChange to fire
        await new Promise<void>((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_IN") {
              subscription.unsubscribe();
              resolve();
            }
          });
          // Fallback timeout
          setTimeout(() => { subscription.unsubscribe(); resolve(); }, 3000);
        });
        router.replace("/");
        return;
      }

      // PKCE flow fallback: code comes in query param
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace("/");
        return;
      }

      // No token found - go home
      router.replace("/");
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
