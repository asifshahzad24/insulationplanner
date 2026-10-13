import { site } from "@/config/site";
import { getContent } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { MARKET_IDS, MARKETS } from "@/markets/meta";
import { pathOf, routesFor } from "@/routes/registry";

export const dynamic = "force-static";

// https://llmstxt.org — a plain-text map of the site for AI assistants.
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    "> Free, independent insulation calculators for homeowners in the United States, United Kingdom, Germany and France. Each calculator returns the depth to add, the number of bags/rolls/boards to buy and a material cost range, using published building-code targets (2021 IECC/ENERGY STAR, Approved Document L, GEG/BEG, CEE/MaPrimeRénov') and manufacturer coverage data.",
    "",
  ];
  for (const id of MARKET_IDS) {
    lines.push(`## ${MARKETS[id].name} (${MARKETS[id].lang})`, "");
    for (const entry of routesFor(id)) {
      const c = getContent(entry);
      lines.push(`- [${c.h1}](${absoluteUrl(pathOf(entry))}): ${c.description}`);
    }
    lines.push("");
  }
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
