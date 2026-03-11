import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Cookie-based storage for cross-subdomain session sharing (.moveworthapp.com)
const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null;
    const encodedKey = encodeURIComponent(key);
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${encodedKey.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&")}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    const isLocal = window.location.hostname === "localhost";
    const domain = isLocal ? "" : "; domain=.moveworthapp.com";
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${domain}; path=/; expires=${expires}; SameSite=Lax`;
  },
  removeItem: (key: string): void => {
    if (typeof document === "undefined") return;
    const isLocal = window.location.hostname === "localhost";
    const domain = isLocal ? "" : "; domain=.moveworthapp.com";
    document.cookie = `${encodeURIComponent(key)}=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
  },
});
