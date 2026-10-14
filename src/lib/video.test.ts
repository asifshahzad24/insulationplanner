import { describe, expect, it } from "vitest";
import { MARKET_IDS } from "@/markets/meta";
import { isoDuration, videoDurationSec, videoInfo } from "./video";

describe("home-page videos", () => {
  for (const market of MARKET_IDS) {
    it(`reads a real duration for ${market}`, () => {
      const seconds = videoDurationSec(market);
      expect(seconds).toBeGreaterThanOrEqual(20);
      expect(seconds).toBeLessThanOrEqual(90);
      const info = videoInfo(market);
      expect(info.durationSec).toBe(seconds);
      expect(isoDuration(seconds)).toBe(`PT${seconds}S`);
      expect(info.contentUrl).toContain(`/video/${market}.mp4`);
      expect(info.name.length).toBeGreaterThan(3);
    });
  }
});
