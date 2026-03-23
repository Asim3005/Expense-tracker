import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar, MainContent } from "@/components/layout/sidebar";
import { Toaster, ToasterProvider } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
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
  title: "FinTrack - Personal Finance Dashboard",
  description: "Track your income, expenses, and financial goals with a beautiful, modern dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToasterProvider>
          <ThemeProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <MainContent>
                {children}
              </MainContent>
            </div>
            <Toaster />
          </ThemeProvider>
        </ToasterProvider>
      </body>
    </html>
  );
}
