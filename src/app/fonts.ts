import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

// next/font downloads these at build time and self-hosts them,
// so visitors never contact Google (GDPR-friendly).
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${bricolage.variable} ${geist.variable} ${geistMono.variable}`;
