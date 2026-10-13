import { ogImage, ogSize } from "@/lib/og";

export const alt = "Insulation Planner";
export const size = ogSize;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage("de");
}
