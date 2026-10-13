import { MarketPage, pageMetadata } from "@/routes/page-helpers";

export const metadata = pageMetadata("uk", "");

export default function Page() {
  return <MarketPage market="uk" slug="" />;
}
