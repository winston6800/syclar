import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syclar | Work in Cycles. Build Momentum. Never Stop.",
  description: "Do as many cycles of work as possible. Work nonstop to generate momentum and never stop. Complete cycles continuously.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="bottom-center" />
          <div className="relative min-h-screen">
            {/* Global toggle between Strategy & Tactical */}
            <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center">
              <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white/80 px-2 py-1 text-xs shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
                <span className="hidden px-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 sm:inline">
                  Stations
                </span>
                <Link
                  href="/strategy"
                  className="rounded-full px-3 py-1 text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Strategy & Ops
                </Link>
                <Link
                  href="/tactical"
                  className="rounded-full px-3 py-1 text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Tactical
                </Link>
              </div>
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
