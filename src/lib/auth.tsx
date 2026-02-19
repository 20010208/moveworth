"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface User {
  lastName: string;
  middleName?: string;
  firstName: string;
  email: string;
  nationality: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (data: Omit<User, "registeredAt">) => void;
  logout: () => void;
  showRegisterModal: boolean;
  setShowRegisterModal: (show: boolean) => void;
  onRegisterCallback: (() => void) | null;
  setOnRegisterCallback: (cb: (() => void) | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "moveworth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [onRegisterCallback, setOnRegisterCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}
    setMounted(true);
  }, []);

  const register = useCallback((data: Omit<User, "registeredAt">) => {
    const newUser: User = {
      ...data,
      registeredAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setShowRegisterModal(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          register,
          logout,
          showRegisterModal: false,
          setShowRegisterModal,
          onRegisterCallback: null,
          setOnRegisterCallback,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        register,
        logout,
        showRegisterModal,
        setShowRegisterModal,
        onRegisterCallback,
        setOnRegisterCallback,
      }}
    >
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
