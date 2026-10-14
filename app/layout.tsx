import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";
import DisclaimerGate from "@/app/disclaimer-gate";
import DisclaimerText from "@/app/disclaimer-text";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "stockpairs",
  description:
    "Live board of meme coins paired with tokenized stocks and crypto on Solana and Robinhood Chain.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {children}
        <footer className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 pt-4 pb-10 text-xs text-muted">
          <DisclaimerText />
        </footer>
        <DisclaimerGate>
          <DisclaimerText />
        </DisclaimerGate>
      </body>
    </html>
  );
}
