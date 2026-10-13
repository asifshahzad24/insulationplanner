// US ZIP → 2021 IECC climate zone, from static chunks in /public/data/zip/<zip3>.json
// (built from PNNL-33270 county zones + Census 2020 ZCTA→county relationships).

type Chunk = Record<string, string>;
const cache = new Map<string, Promise<Chunk | null>>();

export async function lookupZone(zip: string, fetchImpl: typeof fetch = fetch): Promise<string | null> {
  const z = zip.trim();
  if (!/^\d{5}$/.test(z)) return null;
  const prefix = z.slice(0, 3);
  let chunk = cache.get(prefix);
  if (!chunk) {
    chunk = fetchImpl(`/data/zip/${prefix}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Chunk>) : null))
      .catch(() => null);
    cache.set(prefix, chunk);
  }
  const data = await chunk;
  return data?.[z] ?? null;
}

/** All zones in display order, for the fallback picker. */
export const US_ZONES = ["1A", "2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C", "5A", "5B", "5C", "6A", "6B", "7", "8"];
