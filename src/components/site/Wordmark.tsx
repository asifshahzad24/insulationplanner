import { site } from "@/config/site";
import { LogoMark } from "./Logo";

/**
 * Brand lockup: thermal house mark + "LoftInsulationCalc" (mirrors the domain).
 * "Calc" carries the thermal gradient on dark backgrounds and the accent colour on light ones.
 */
export function Wordmark({ tone = "dark", size = "md" }: { tone?: "dark" | "light"; size?: "md" | "lg" }) {
  return (
    <span className="flex items-center gap-2 sm:gap-2.5">
      <LogoMark className={size === "lg" ? "size-7" : "size-6"} />
      <span className="sr-only">{site.name}</span>
      <span
        aria-hidden
        className={`whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.02em] ${
          size === "lg" ? "text-lg" : "text-[15px] sm:text-[17px]"
        }`}
      >
        LoftInsulation
        <span className={tone === "dark" ? "thermal-text" : "text-accent-ink"}>Calc</span>
      </span>
    </span>
  );
}
