import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        geist.variable,
        mono.variable,
        "scroll-smooth"
      )}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <FloatingButtons />

          <Footer />
          </ThemeProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}