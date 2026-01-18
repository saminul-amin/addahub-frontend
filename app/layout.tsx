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
  title: {
    default: "AddaHub",
    template: "%s | AddaHub",
  },
  description: "Connect locally with AddaHub",
  icons: {
    icon: "/adda.webp",
  },
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/components/theme-provider";
import GoogleAuthProviderWrapper from "@/components/GoogleAuthProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAuthProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </GoogleAuthProviderWrapper>
      </body>
    </html>
  );
}
