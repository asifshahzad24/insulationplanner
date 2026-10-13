import { MarketPage, pageMetadata, slugParams } from "@/routes/page-helpers";

export const dynamicParams = false;
export const generateStaticParams = () => slugParams("fr");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return pageMetadata("fr", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <MarketPage market="fr" slug={(await params).slug} />;
}
