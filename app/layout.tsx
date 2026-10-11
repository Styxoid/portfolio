import type { Metadata } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import { PROFILE } from "@/lib/data";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${PROFILE.name} | ${PROFILE.role}`,
  description: PROFILE.bio,
  keywords: [
    "Robotics Engineer",
    "AI Engineer",
    "Computer Vision",
    "Full-Stack Developer",
    "Three.js Portfolio",
    "Interactive 3D",
    "Playing Cards Portfolio",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title: `${PROFILE.name} | ${PROFILE.role}`,
    description: PROFILE.bio,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#08090c] text-[#f1f5f9] antialiased selection:bg-gold selection:text-[#08090c]">
        <Nav />
        <main className="w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
