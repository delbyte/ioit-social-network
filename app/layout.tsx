import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import { MainNav } from "@/components/navigation/main-nav";
import { AuthProvider } from "@/components/providers/auth-provider";
import { InterestProvider } from "@/components/providers/interest-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseGather",
  description:
    "Event-only social network with timeline, discover, and one-click interest + calendar deep links.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <InterestProvider>
            <MainNav />
            <main className="content-shell">{children}</main>
          </InterestProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
