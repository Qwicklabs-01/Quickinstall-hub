import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickInstall Hub",
  description: "Install multiple Windows apps at once with ease.",
};

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SelectionProvider } from "./context/SelectionContext";
import SelectionTray from "../components/SelectionTray";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <SelectionProvider>
          <Header />
          <main className="flex-grow pb-36 md:pb-24">
            {children}
          </main>
          <SelectionTray />
          <Footer />
        </SelectionProvider>
      </body>
    </html>
  );
}
