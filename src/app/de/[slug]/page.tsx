import { MarketPage, pageMetadata, slugParams } from "@/routes/page-helpers";

export const dynamicParams = false;
export const generateStaticParams = () => slugParams("de");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return pageMetadata("de", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <MarketPage market="de" slug={(await params).slug} />;
}
