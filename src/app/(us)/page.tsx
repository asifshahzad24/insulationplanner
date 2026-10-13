import { MarketPage, pageMetadata } from "@/routes/page-helpers";

export const metadata = pageMetadata("us", "");

export default function Page() {
  return <MarketPage market="us" slug="" />;
}
