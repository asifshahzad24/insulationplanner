import { describe, expect, it, vi } from "vitest";
import { lookupZone } from "./zip";

const fakeFetch = (data: Record<string, string> | null) =>
  vi.fn(async () => ({ ok: data != null, json: async () => data }) as Response);

describe("lookupZone", () => {
  it("reads the zip3 chunk and returns the zone", async () => {
    const f = fakeFetch({ "60601": "5A" });
    expect(await lookupZone("60601", f as unknown as typeof fetch)).toBe("5A");
    expect(f).toHaveBeenCalledWith("/data/zip/606.json");
  });

  it("rejects malformed ZIPs without fetching", async () => {
    const f = fakeFetch({});
    expect(await lookupZone("6060", f as unknown as typeof fetch)).toBeNull();
    expect(await lookupZone("abcde", f as unknown as typeof fetch)).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });

  it("returns null for unknown ZIPs and missing chunks", async () => {
    expect(await lookupZone("99999", fakeFetch({}) as unknown as typeof fetch)).toBeNull();
    expect(await lookupZone("00601", fakeFetch(null) as unknown as typeof fetch)).toBeNull();
  });
});
