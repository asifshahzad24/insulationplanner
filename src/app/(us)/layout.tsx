import type { Metadata } from "next";
import "../globals.css";
import { site } from "@/config/site";
import { RootShell } from "@/components/site/RootShell";

export const metadata: Metadata = { metadataBase: new URL(site.url) };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell market="us">{children}</RootShell>;
}
