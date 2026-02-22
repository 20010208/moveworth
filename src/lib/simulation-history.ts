import { SimulationInput, SimulationResult, ExtraComparisonInput } from "@/lib/simulation/types";

export interface SimulationHistoryEntry {
  id: string;
  date: string;
  countryFrom: string;
  countryTo: string;
  input: SimulationInput;
  result: SimulationResult;
  extraInputs?: ExtraComparisonInput[];
  extraResults?: SimulationResult[];
}

const MAX_ENTRIES_FREE = 3;
const MAX_ENTRIES_PRO = 30;
const MAX_ENTRIES_PREMIUM = 100;

export type UserPlan = "free" | "pro" | "premium";

// ユーザーIDごとに別キーを使用して履歴を分離
function storageKey(userId?: string): string {
  return userId ? `moveworth_history_${userId}` : "moveworth_history";
}

export function getHistory(userId?: string): SimulationHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(storageKey(userId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHistory(
  input: SimulationInput,
  result: SimulationResult,
  plan: UserPlan = "free",
  extraInputs?: ExtraComparisonInput[],
  extraResults?: SimulationResult[],
  userId?: string
): SimulationHistoryEntry | null {
  const key = storageKey(userId);
  const history = getHistory(userId);
  const maxEntries =
    plan === "premium"
      ? MAX_ENTRIES_PREMIUM
      : plan === "pro"
      ? MAX_ENTRIES_PRO
      : MAX_ENTRIES_FREE;

  if (history.length >= maxEntries) {
    return null;
  }

  const entry: SimulationHistoryEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    countryFrom: input.countryFrom,
    countryTo: input.countryTo,
    input,
    result,
    ...(extraInputs && extraInputs.length > 0 && { extraInputs }),
    ...(extraResults && extraResults.length > 0 && { extraResults }),
  };

  history.unshift(entry);

  const trimmed = history.slice(0, maxEntries);
  localStorage.setItem(key, JSON.stringify(trimmed));

  return entry;
}

export function isAtFreeLimit(userId?: string): boolean {
  return getHistory(userId).length >= MAX_ENTRIES_FREE;
}

export function deleteHistory(id: string, userId?: string): void {
  const key = storageKey(userId);
  const history = getHistory(userId).filter((entry) => entry.id !== id);
  localStorage.setItem(key, JSON.stringify(history));
}

export function clearHistory(userId?: string): void {
  localStorage.removeItem(storageKey(userId));
}
