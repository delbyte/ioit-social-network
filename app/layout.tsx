import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { MainNav } from "@/components/navigation/main-nav";
import { AuthProvider } from "@/components/providers/auth-provider";
import { InterestProvider } from "@/components/providers/interest-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
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
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full">
        <AuthProvider>
          <InterestProvider>
            <MainNav />
            <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 lg:py-12">{children}</main>
          </InterestProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
