import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import { ClientProviders } from "./providers/ClientProviders";
import { ClerkClientProvider } from "./providers/ClerkClientProvider";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";

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
  title: "Pyuto | Premium T-Shirts Collection",
  description: "Discover our premium collection of t-shirts at Pyuto. High-quality fabrics, trendy designs, and exceptional comfort.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClerkClientProvider>
          <ConvexClientProvider>
            <ClientProviders>
              <LoadingScreen />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ClientProviders>
          </ConvexClientProvider>
        </ClerkClientProvider>
      </body>
    </html>
  );
}
