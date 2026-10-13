import { MarketPage, pageMetadata } from "@/routes/page-helpers";

export const metadata = pageMetadata("de", "");

export default function Page() {
  return <MarketPage market="de" slug="" />;
}
