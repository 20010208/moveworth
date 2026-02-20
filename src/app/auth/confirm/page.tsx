"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n";

export default function AuthConfirmPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleConfirmation = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "email",
        });
        setStatus(error ? "error" : "success");
        return;
      }

      // Handle hash-based redirect (access_token in URL hash)
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        setStatus("success");
        return;
      }

      // Check if already authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    handleConfirmation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-border/60 rounded-2xl shadow-sm p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Globe className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            MoveWorth
          </span>
        </div>

        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-lg font-semibold text-foreground">
              {t("authConfirm.verifying")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-5">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              {t("authConfirm.successTitle")}
            </h1>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              {t("authConfirm.successDesc")}
            </p>
            <div className="space-y-3">
              <Link
                href="/simulate"
                className="block w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
              >
                {t("authConfirm.startSimulation")}
              </Link>
              <Link
                href="/"
                className="block w-full border border-border/60 text-muted px-6 py-3 rounded-xl font-medium text-sm hover:text-foreground hover:border-primary/40 transition-all"
              >
                {t("authConfirm.backHome")}
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 mb-5">
              <XCircle className="h-10 w-10 text-danger" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              {t("authConfirm.errorTitle")}
            </h1>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              {t("authConfirm.errorDesc")}
            </p>
            <Link
              href="/"
              className="block w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
            >
              {t("authConfirm.backHome")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
