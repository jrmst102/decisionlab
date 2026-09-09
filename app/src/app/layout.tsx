import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Decision Making Lab | NYU",
    template: "%s | Decision Making Lab",
  },
  description:
    "Open, interactive tools for decision analysis, pricing, competitive strategy, negotiation, and scenario planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-montserrat)]">
        {children}
      </body>
    </html>
  );
}
