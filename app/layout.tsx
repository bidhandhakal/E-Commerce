import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import { ClientProviders } from "./providers/ClientProviders";
import { ClerkClientProvider } from "./providers/ClerkClientProvider";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import ClerkPreload from "./components/ClerkPreload";
import { Analytics } from '@vercel/analytics/react';
import PageWrapper from "./page-wrapper";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxera | Premium T-Shirts Collection",
  description: "Discover our premium collection of t-shirts at Pyuto. High-quality fabrics, trendy designs, and exceptional comfort.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.141 0.005 285.823)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(1 0 0)' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <head>
        {/* Critical CSS applied immediately */}
        <style>{`
          html, body { 
            margin: 0; 
            padding: 0; 
            background-color: var(--background); 
          }
          
          /* Force light theme for no-js users */
          body:not(:has(script)) {
            background-color: oklch(0.141 0.005 285.823) !important;
            color: white !important;
          }
        `}</style>
      </head>
      <body
        className={`${geistMono.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-background`}
      >
        <ClerkClientProvider>
          <ConvexClientProvider>
            <ClientProviders>
              <LoadingScreen />
              <ClerkPreload />
              <div id="content-wrapper" className="flex min-h-screen flex-col bg-background">
                <Navbar />
                <main className="flex-1">
                  <PageWrapper>
                    {children}
                  </PageWrapper>
                </main>
                <Footer />
              </div>
              <Analytics />
            </ClientProviders>
          </ConvexClientProvider>
        </ClerkClientProvider>
      </body>
    </html>
  );
}
