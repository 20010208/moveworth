"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Cross-subdomain session sharing via cookie (access_token + refresh_token only)
// Both tokens are ASCII (JWT base64url + random string) — safe for btoa/atob
const MW_TOKEN_COOKIE = "mw_tok";

function getCookieDomain(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "";
  return "; domain=.moveworthapp.com";
}

function setTokenCookie(accessToken: string, refreshToken: string) {
  const val = btoa(accessToken + "|" + refreshToken);
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${MW_TOKEN_COOKIE}=${val}${getCookieDomain()}; path=/; expires=${expires}; SameSite=Lax`;
}

function removeTokenCookie() {
  document.cookie = `${MW_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${getCookieDomain()}; SameSite=Lax`;
}

function getTokenCookie(): { accessToken: string; refreshToken: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)mw_tok=([^;]*)/);
  if (!match) return null;
  try {
    const decoded = atob(match[1]);
    const idx = decoded.indexOf("|");
    if (idx === -1) return null;
    return { accessToken: decoded.slice(0, idx), refreshToken: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

export type UserPlan = "free" | "pro" | "premium";

export interface UserProfile {
  id: string;
  lastName: string;
  middleName?: string;
  firstName: string;
  email: string;
  nationality: string;
  plan: UserPlan;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  showRegisterModal: boolean;
  setShowRegisterModal: (show: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  onRegisterCallback: (() => void) | null;
  setOnRegisterCallback: (cb: (() => void) | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toUserProfile(supabaseUser: SupabaseUser): UserProfile {
  const meta = supabaseUser.user_metadata;
  const plan = (meta?.plan as UserPlan) || "free";
  return {
    id: supabaseUser.id,
    lastName: meta?.lastName || "",
    middleName: meta?.middleName || undefined,
    firstName: meta?.firstName || "",
    email: supabaseUser.email || "",
    nationality: meta?.nationality || "",
    plan,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [onRegisterCallback, setOnRegisterCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(toUserProfile(session.user));
        setTokenCookie(session.access_token, session.refresh_token);
      } else {
        // No local session — try cross-domain cookie (e.g. coming from study site)
        const tok = getTokenCookie();
        if (tok) {
          const { data } = await supabase.auth.setSession({
            access_token: tok.accessToken,
            refresh_token: tok.refreshToken,
          });
          if (data.session?.user) {
            setUser(toUserProfile(data.session.user));
            setTokenCookie(data.session.access_token, data.session.refresh_token);
          } else {
            removeTokenCookie();
          }
        }
      }
      setMounted(true);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toUserProfile(session.user));
        setTokenCookie(session.access_token, session.refresh_token);
      } else {
        setUser(null);
        removeTokenCookie();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    removeTokenCookie();
    setUser(null);
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    logout,
    showRegisterModal,
    setShowRegisterModal,
    showLoginModal,
    setShowLoginModal,
    onRegisterCallback,
    setOnRegisterCallback,
  };

  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          ...contextValue,
          user: null,
          isAuthenticated: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
