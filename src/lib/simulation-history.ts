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
const MAX_ENTRIES = 10;

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
  result: SimulationResult
): SimulationHistoryEntry {
  const entry: SimulationHistoryEntry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    countryFrom: input.countryFrom,
    countryTo: input.countryTo,
    input,
    result,
  };

  const history = getHistory();
  history.unshift(entry);

  // Keep only the most recent entries
  const trimmed = history.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  return entry;
}

export function deleteHistory(id: string): void {
  const history = getHistory().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
