import { ogImage } from "@/lib/og";

export const dynamic = "force-static";

// Served as /og/uk.png (static file in the export).
export function GET() {
  return ogImage("uk");
}
