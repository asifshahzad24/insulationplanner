import { MarketPage, pageMetadata, slugParams } from "@/routes/page-helpers";

export const dynamicParams = false;
export const generateStaticParams = () => slugParams("uk");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return pageMetadata("uk", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <MarketPage market="uk" slug={(await params).slug} />;
}
