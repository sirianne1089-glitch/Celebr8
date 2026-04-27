import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Celebr8 — Premium Digital Invitations",
    template: "%s · Celebr8",
  },
  description:
    "Celebr8 is a premium digital invitation platform for weddings, birthdays, housewarmings, baby ceremonies, festivals and corporate events. Telugu, English and Hindi support. Made for India and NRI families.",
  keywords: [
    "digital invitation",
    "wedding invite",
    "Telugu invitation",
    "Indian invitation",
    "Gruhapravesam",
    "RSVP online",
    "WhatsApp invite",
    "NRI invitation",
  ],
  openGraph: {
    title: "Celebr8 — Premium Digital Invitations",
    description: "Premium animated invitations for every Indian celebration.",
    type: "website",
    url: "/",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFCF6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-stage font-sans">{children}</body>
    </html>
  );
}
