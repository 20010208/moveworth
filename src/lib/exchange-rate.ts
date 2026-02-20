const CACHE_KEY = "moveworth_exchange_rates";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CacheEntry {
  rates: Record<string, number>;
  base: string;
  timestamp: number;
}

function getCache(base: string): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(CACHE_KEY);
    if (!data) return null;
    const cache: CacheEntry = JSON.parse(data);
    if (cache.base !== base || Date.now() - cache.timestamp > CACHE_TTL) return null;
    return cache.rates;
  } catch {
    return null;
  }
}

function setCache(base: string, rates: Record<string, number>) {
  if (typeof window === "undefined") return;
  const entry: CacheEntry = { rates, base, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
}

/**
 * Fetch exchange rate: how much 1 unit of `to` currency is worth in `from` currency.
 * Example: fetchExchangeRate("JPY", "MYR") → ~33 (1 MYR = 33 JPY)
 */
export async function fetchExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number | null> {
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) return 1;

  try {
    // Check cache first
    const cached = getCache(toCurrency);
    if (cached && cached[fromCurrency]) {
      return cached[fromCurrency];
    }

    // Frankfurter API: free, no key needed
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${toCurrency}&to=${fromCurrency}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rate = data.rates?.[fromCurrency];

    if (rate) {
      setCache(toCurrency, data.rates);
      return rate;
    }

    return null;
  } catch {
    return null;
  }
}
