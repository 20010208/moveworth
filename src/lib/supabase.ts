import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Unicode-safe base64 encoding (handles Japanese names in Google user_metadata)
const b64Encode = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const b64Decode = (str: string): string => {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

// Cookie-based storage for cross-subdomain session sharing (.moveworthapp.com)
const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null;
    const encodedKey = encodeURIComponent(key);
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${encodedKey.replace(/[.*+?^=!:${}()|[\]/\\]/g, "\\$&")}=([^;]*)`)
    );
    if (!match) return null;
    try {
      return b64Decode(match[1]);
    } catch {
      try { return decodeURIComponent(match[1]); } catch { return match[1]; }
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    const isLocal = window.location.hostname === "localhost";
    const domain = isLocal ? "" : "; domain=.moveworthapp.com";
    document.cookie = `${encodeURIComponent(key)}=${b64Encode(value)}${domain}; path=/; expires=${expires}; SameSite=Lax`;
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
    flowType: "implicit",
  },
});
