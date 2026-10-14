import type { MarketId } from "@/engine/types";
import type { Dict } from "@/i18n";
import { MARKETS } from "@/markets/meta";

/**
 * "See how it works" walkthrough on home pages. Self-hosted (no third-party cookies) and
 * preload="none", so nothing downloads until the visitor presses play.
 * Files come from video/ (npm run render there): public/video/<market>.mp4, -poster.jpg, .vtt
 */
export function PromoVideo({ market, dict }: { market: MarketId; dict: Dict }) {
  const p = dict.page;
  return (
    <section aria-labelledby="video-title" className="mt-14">
      <h2 id="video-title" className="font-display text-[1.6rem] font-bold leading-tight tracking-[-0.02em] text-ink">
        {p.videoTitle}
      </h2>
      <p id="video-desc" className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
        {p.videoDesc}
      </p>
      <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] border border-line bg-night shadow-[0_24px_48px_-28px_rgba(11,14,20,.35)]">
        <video
          controls
          preload="none"
          playsInline
          width={1280}
          height={720}
          poster={`/video/${market}-poster.jpg`}
          aria-describedby="video-desc"
          className="block aspect-video h-auto w-full"
        >
          <source src={`/video/${market}.mp4`} type="video/mp4" />
          <track kind="captions" src={`/video/${market}.vtt`} srcLang={MARKETS[market].lang} label={p.videoCaptions} />
        </video>
      </div>
    </section>
  );
}
