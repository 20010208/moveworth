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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(toUserProfile(session.user));
      }
      setMounted(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toUserProfile(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
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
