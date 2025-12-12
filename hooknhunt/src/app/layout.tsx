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
    <html lang="bn" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Theme initialization
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}

              // Comprehensive error filtering for third-party scripts
              const originalConsoleError = console.error;
              console.error = function(...args) {
                // Filter out known third-party script errors
                const message = args.join(' ');
                if (message.includes('page-events') ||
                    message.includes("Cannot read properties of undefined (reading 'length')") ||
                    message.includes('Extension context invalidated')) {
                  return; // Silently filter these errors
                }
                originalConsoleError.apply(console, args);
              };

              // Filter out third-party script errors
              window.addEventListener('error', function(e) {
                // Ignore page-events.js errors
                if (e.filename && (
                    e.filename.includes('page-events') ||
                    e.filename.includes('extension') ||
                    e.filename.includes('chrome-extension')
                )) {
                  e.preventDefault();
                  return false;
                }

                // Ignore specific error messages
                if (e.message && (
                    e.message.includes("Cannot read properties of undefined (reading 'length')") ||
                    e.message.includes('Extension context invalidated') ||
                    e.message.includes('Receiving end does not exist')
                )) {
                  e.preventDefault();
                  return false;
                }
              });

              // Filter out unhandled promise rejections
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && (
                    e.reason.message.includes("Cannot read properties of undefined (reading 'length')") ||
                    e.reason.message.includes('Extension context invalidated') ||
                    e.reason.message.includes('Receiving end does not exist')
                )) {
                  e.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
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
