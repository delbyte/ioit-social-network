import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/navigation/main-nav";
import { AuthProvider } from "@/components/providers/auth-provider";
import { InterestProvider } from "@/components/providers/interest-provider";
import { IconProvider } from "@/lib/icon-context";
import { ShapeProvider } from "@/lib/shape-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mingle",
  description:
    "Event-only social network. Plan, RSVP, and sync to your calendar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background font-sans antialiased">
        <ShapeProvider defaultShape="rounded">
          <IconProvider defaultLibrary="phosphor">
            <AuthProvider>
              <InterestProvider>
                <MainNav />
                <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:px-6 md:pb-12 md:pt-8 lg:px-8">
                  {children}
                </main>
              </InterestProvider>
            </AuthProvider>
          </IconProvider>
        </ShapeProvider>
      </body>
    </html>
  );
}
