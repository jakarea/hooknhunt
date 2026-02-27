import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hook & Hunt - Premium Fishing Accessories",
  description: "Your premier destination for quality fishing accessories and equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" >
      <head>

      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900 transition-colors duration-200`} suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CartSidebar />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
