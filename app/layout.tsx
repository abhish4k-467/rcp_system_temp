import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-barlow",
  display: "swap"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rcpsystem.com"),
  title: "Rack Collapse Prevention | We Stop Rack Collapses",
  description:
    "A cinematic redesign concept for Rack Collapse Prevention's patented warehouse racking safety system.",
  openGraph: {
    title: "We Stop Rack Collapses. Full Stop.",
    description:
      "The UK's patented racking safety system, proven in real incidents and installed across the UK, Ireland and Europe.",
    images: ["/images/hero-poster.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${dmSans.variable}`}>{children}</body>
    </html>
  );
}
