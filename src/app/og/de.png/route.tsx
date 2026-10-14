import { ogImage } from "@/lib/og";

export const dynamic = "force-static";

// Served as /og/de.png (static file in the export).
export function GET() {
  return ogImage("de");
}
