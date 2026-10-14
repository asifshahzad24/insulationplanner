import type { Metadata } from "next";
import "../globals.css";
import { viewport } from "@/config/viewport";
import { site } from "@/config/site";
import { RootShell } from "@/components/site/RootShell";

export { viewport };
export const metadata: Metadata = { metadataBase: new URL(site.url) };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell market="fr">{children}</RootShell>;
}
