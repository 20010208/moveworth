import { SimulationInput, SimulationResult } from "@/lib/simulation/types";

export interface SimulationHistoryEntry {
  id: string;
  date: string;
  countryFrom: string;
  countryTo: string;
  input: SimulationInput;
  result: SimulationResult;
}

const STORAGE_KEY = "moveworth_history";
const MAX_ENTRIES_FREE = 3;
const MAX_ENTRIES_PRO = 30;
const MAX_ENTRIES_PREMIUM = 100;

export type UserPlan = "free" | "pro" | "premium";

export function getHistory(): SimulationHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHistory(
  input: SimulationInput,
  result: SimulationResult,
  plan: UserPlan = "free"
): SimulationHistoryEntry | null {
  const history = getHistory();
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
  };

  history.unshift(entry);

  const trimmed = history.slice(0, maxEntries);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  return entry;
}

export function isAtFreeLimit(): boolean {
  return getHistory().length >= MAX_ENTRIES_FREE;
}

export function deleteHistory(id: string): void {
  const history = getHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
